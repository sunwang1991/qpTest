"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const core_1 = require("@midwayjs/core");
const room_1 = require("../repository/room");
const transaction_1 = require("../repository/transaction");
/**
 * 房间信息 服务层处理
 */
let RoomService = exports.RoomService = class RoomService {
    roomRepository;
    transactionRepository;
    /**
     * 创建房间
     * @param creator 创建者ID
     * @param roomName 房间名称（可选）
     * @returns 房间信息
     */
    async create(creator, roomName) {
        // 检查用户是否已有进行中的房间
        const activeRoom = await this.roomRepository.findActiveRoomByUserId(creator);
        if (activeRoom)
            return activeRoom;
        // 创建房间数据
        const roomData = {
            creatorId: creator,
            roomName: roomName || `房间_${Date.now()}`,
            statusFlag: '1',
            remark: '',
        };
        // 插入房间记录
        const insertResult = await this.roomRepository.insertRoom(roomData);
        const raw = insertResult.raw;
        if (raw.insertId <= 0) {
            throw new Error('创建房间失败');
        }
        // 建立房间与创建者的关联关系
        await this.roomRepository.insertRoomUser(raw.insertId, creator);
        // 查询并返回创建的房间信息
        const newRoom = await this.roomRepository.findRoomById(raw.insertId);
        if (!newRoom) {
            throw new Error('获取房间信息失败');
        }
        return newRoom;
    }
    /**
     * 根据房间ID获取房间信息
     * @param roomId 房间ID
     * @returns 房间信息
     */
    async getRoomById(roomId) {
        return await this.roomRepository.findRoomById(roomId);
    }
    /**
     * 获取用户的所有房间
     * @param userId 用户ID
     * @returns 房间列表
     */
    async getUserRooms(userId) {
        return await this.roomRepository.selectByUserId(userId);
    }
    /**
     * 获取用户当前进行中的房间
     * @param userId 用户ID
     * @returns 房间信息或null
     */
    async getUserActiveRoom(userId) {
        return await this.roomRepository.findActiveRoomByUserId(userId);
    }
    /**
     * 获取房间内所有用户
     * @param roomId 房间ID
     * @returns 用户列表
     */
    async getRoomUsers(roomId) {
        return await this.roomRepository.selectUsersByRoomId(roomId);
    }
    /**
     * 结束房间（设置为已结算状态）
     * @param roomId 房间ID
     * @param userId 操作用户ID（验证权限）
     * @returns 是否成功
     */
    async finishRoom(roomId, userId) {
        // 验证房间是否存在且用户有权限操作
        const room = await this.roomRepository.findRoomById(roomId);
        if (!room) {
            throw new Error('房间不存在');
        }
        if (room.statusFlag === '2') {
            throw new Error('房间已经结束');
        }
        // 更新房间状态为已结算
        const result = await this.roomRepository.updateRoomStatus(roomId, '2');
        return result.affected > 0;
    }
    /**
     * 更新房间信息
     * @param roomId 房间ID
     * @param userId 操作用户ID（验证权限）
     * @param roomData 房间数据
     * @returns 是否成功
     */
    async updateRoom(roomId, userId, roomData) {
        // 验证房间是否存在且用户有权限操作
        const room = await this.roomRepository.findRoomById(roomId);
        if (!room) {
            throw new Error('房间不存在');
        }
        if (room.creatorId !== userId) {
            throw new Error('只有房间创建者可以修改房间信息');
        }
        // 更新房间信息
        const updateData = {
            roomName: roomData.roomName || room.roomName,
            remark: roomData.remark || room.remark,
            statusFlag: room.statusFlag, // 保持原状态
        };
        const result = await this.roomRepository.updateRoom(roomId, updateData);
        return result.affected > 0;
    }
    /**
     * 删除房间（软删除）
     * @param roomId 房间ID
     * @param userId 操作用户ID（验证权限）
     * @returns 是否成功
     */
    async deleteRoom(roomId, userId) {
        // 验证房间是否存在且用户有权限操作
        const room = await this.roomRepository.findRoomById(roomId);
        if (!room) {
            throw new Error('房间不存在');
        }
        if (room.creatorId !== userId) {
            throw new Error('只有房间创建者可以删除房间');
        }
        // 软删除房间
        const result = await this.roomRepository.deleteRoom(roomId);
        return result.affected > 0;
    }
    /**
     * 加入房间
     */
    async joinRoom(userId, roomId) {
        // 验证房间是否存在
        const room = await this.roomRepository.findRoomById(roomId);
        if (!room) {
            throw new Error('房间不存在');
        }
        if (room.statusFlag !== '1') {
            throw new Error('房间已结束');
        }
        // 验证用户是否已加入房间
        const roomUsers = await this.roomRepository.selectUsersByRoomId(roomId);
        const userExists = roomUsers.some(user => user.id === userId);
        if (userExists) {
            throw new Error('用户已加入房间');
        }
        // 加入房间
        await this.roomRepository.insertRoomUser(roomId, userId);
        return room;
    }
    /**
     * 查询对局记录（分页）
     * @param params 查询参数
     * @returns 对局记录列表
     */
    async getGameRecords(params) {
        const { userId, roomId, page, pageSize } = params;
        const offset = (page - 1) * pageSize;
        try {
            // 获取房间列表（根据条件筛选）
            const rooms = await this.roomRepository.getGameRecords({
                userId,
                roomId,
                offset,
                limit: pageSize,
            });
            // 获取总数
            const total = await this.roomRepository.getGameRecordsCount({
                userId,
                roomId,
            });
            // 为每个房间获取成员收入情况
            const gameRecordsWithStats = await Promise.all(rooms.map(async (room) => {
                // 获取房间成员
                const roomUsers = await this.roomRepository.selectUsersByRoomId(room.id);
                // 获取房间交易统计
                const transactionStats = await this.transactionRepository.getRoomUserTransactionStats(room.id);
                // 合并用户信息和交易统计
                const membersIncome = roomUsers.map((user) => {
                    const userStat = transactionStats.find(stat => stat.userId === user.id);
                    return {
                        userId: user.id,
                        nickName: user.nickName || '',
                        avatar: user.avatar || '',
                        totalPay: userStat ? userStat.totalPay : 0,
                        totalReceive: userStat ? userStat.totalReceive : 0,
                        netAmount: userStat ? userStat.netAmount : 0,
                    };
                });
                // 计算房间总交易金额
                const totalTransactionAmount = transactionStats.reduce((sum, stat) => sum + stat.totalPay, 0);
                return {
                    ...room,
                    membersIncome,
                    totalTransactionAmount,
                    memberCount: roomUsers.length,
                    // 房间状态描述
                    statusText: room.statusFlag === '1' ? '进行中' : '已结束',
                    // 格式化时间
                    createTimeFormatted: new Date(room.createTime).toLocaleString(),
                    updateTimeFormatted: new Date(room.updateTime).toLocaleString(),
                };
            }));
            return {
                records: gameRecordsWithStats,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                    hasNext: page * pageSize < total,
                    hasPrev: page > 1,
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", room_1.RoomRepository)
], RoomService.prototype, "roomRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", transaction_1.TransactionRepository)
], RoomService.prototype, "transactionRepository", void 0);
exports.RoomService = RoomService = __decorate([
    (0, core_1.Provide)()
], RoomService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvc2VydmljZS9yb29tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUVqRCw2Q0FBb0Q7QUFDcEQsMkRBQWtFO0FBR2xFOztHQUVHO0FBRUksSUFBTSxXQUFXLHlCQUFqQixNQUFNLFdBQVc7SUFFZCxjQUFjLENBQWlCO0lBRy9CLHFCQUFxQixDQUF3QjtJQUVyRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBZSxFQUFFLFFBQWlCO1FBQzdDLGlCQUFpQjtRQUNqQixNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQ2pFLE9BQU8sQ0FDUixDQUFDO1FBQ0YsSUFBSSxVQUFVO1lBQUUsT0FBTyxVQUFVLENBQUM7UUFFbEMsU0FBUztRQUNULE1BQU0sUUFBUSxHQUF1QjtZQUNuQyxTQUFTLEVBQUUsT0FBTztZQUNsQixRQUFRLEVBQUUsUUFBUSxJQUFJLE1BQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3hDLFVBQVUsRUFBRSxHQUFHO1lBQ2YsTUFBTSxFQUFFLEVBQUU7U0FDWCxDQUFDO1FBRUYsU0FBUztRQUNULE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEUsTUFBTSxHQUFHLEdBQW9CLFlBQVksQ0FBQyxHQUFHLENBQUM7UUFFOUMsSUFBSSxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzNCO1FBRUQsZ0JBQWdCO1FBQ2hCLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVoRSxl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