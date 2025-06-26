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
/**
 * 房间信息 服务层处理
 */
let RoomService = exports.RoomService = class RoomService {
    roomRepository;
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
        if (room.creatorId !== userId) {
            throw new Error('只有房间创建者可以结束房间');
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
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", room_1.RoomRepository)
], RoomService.prototype, "roomRepository", void 0);
exports.RoomService = RoomService = __decorate([
    (0, core_1.Provide)()
], RoomService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvc2VydmljZS9yb29tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUVqRCw2Q0FBb0Q7QUFHcEQ7O0dBRUc7QUFFSSxJQUFNLFdBQVcseUJBQWpCLE1BQU0sV0FBVztJQUVkLGNBQWMsQ0FBaUI7SUFFdkM7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQWUsRUFBRSxRQUFpQjtRQUM3QyxpQkFBaUI7UUFDakIsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUNqRSxPQUFPLENBQ1IsQ0FBQztRQUNGLElBQUksVUFBVTtZQUFFLE9BQU8sVUFBVSxDQUFDO1FBRWxDLFNBQVM7UUFDVCxNQUFNLFFBQVEsR0FBdUI7WUFDbkMsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLFFBQVEsSUFBSSxNQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN4QyxVQUFVLEVBQUUsR0FBRztZQUNmLE1BQU0sRUFBRSxFQUFFO1NBQ1gsQ0FBQztRQUVGLFNBQVM7UUFDVCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sR0FBRyxHQUFvQixZQUFZLENBQUMsR0FBRyxDQUFDO1FBRTlDLElBQUksR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUU7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMzQjtRQUVELGdCQUFnQjtRQUNoQixNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFaEUsZUFBZTtRQUNmLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFB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