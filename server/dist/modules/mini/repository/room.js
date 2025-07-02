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
exports.RoomRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const room_1 = require("../model/room");
const user_1 = require("../model/user");
const room_user_1 = require("../model/room_user");
/**房间表 数据层处理 */
let RoomRepository = exports.RoomRepository = class RoomRepository {
    db;
    /**
     * 通过房间Id查找房间
     * @param id
     */
    async findRoomById(id) {
        if (id === null)
            return null;
        // 查询数据
        const roomInfo = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('room')
            .from(room_1.RoomModel, 'room')
            .where('room.id = :id', { id: id })
            .getOne();
        if (roomInfo)
            return roomInfo;
        return null;
    }
    /**通过用户Id查找所有存在过的房间 */
    async selectByUserId(userId) {
        const rooms = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('room.*')
            .from(room_user_1.RoomUserModel, 'room_user')
            .leftJoin(room_1.RoomModel, 'room', 'room.id = room_user.room_id')
            .where('room_user.user_id = :userId', { userId: userId })
            .andWhere('room.isDelete = :isDelete', { isDelete: false })
            .getRawMany();
        // 将原始查询结果转换为RoomModel对象
        return rooms.map(room => {
            const roomModel = new room_1.RoomModel();
            roomModel.id = room.id;
            roomModel.creatorId = room.creator;
            roomModel.roomName = room.room_name;
            roomModel.statusFlag = room.status_flag;
            roomModel.remark = room.remark;
            roomModel.createTime = room.createTime;
            roomModel.updateTime = room.updateTime;
            roomModel.isDelete = room.isDelete;
            return roomModel;
        });
    }
    /**
     * 通过房间Id数组查找所有房间
     * @param rooms
     */
    async selectRooms(rooms) {
        const roomList = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('room')
            .from(room_1.RoomModel, 'room')
            .where('room.id IN (:...ids)', { ids: rooms })
            .getMany();
        return roomList;
    }
    /**新增房间 */
    async insertRoom(roomData) {
        const room = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .insert()
            .into(room_1.RoomModel)
            .values({
            creatorId: roomData.creatorId,
            roomName: roomData.roomName || '新房间',
            statusFlag: roomData.statusFlag || '1',
            remark: roomData.remark || '',
            isDelete: false,
        })
            .execute();
        return room;
    }
    /**新增房间用户关联 */
    async insertRoomUser(roomId, userId) {
        const roomUser = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .insert()
            .into(room_user_1.RoomUserModel)
            .values({
            roomId: Number(roomId),
            userId: Number(userId), // 确保转换为数字类型
        })
            .execute();
        return roomUser;
    }
    /**查找用户的进行中房间 */
    async findActiveRoomByUserId(userId) {
        const room = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('room.*')
            .from(room_user_1.RoomUserModel, 'room_user')
            .leftJoin(room_1.RoomModel, 'room', 'room.id = room_user.room_id')
            .where('room_user.user_id = :userId', { userId: userId })
            .andWhere('room.status_flag = :statusFlag', { statusFlag: '1' }) // 正常状态
            .andWhere('room.isDelete = :isDelete', { isDelete: false })
            .getRawOne();
        if (!room)
            return null;
        // 将原始查询结果转换为RoomModel对象
        const roomModel = new room_1.RoomModel();
        roomModel.id = room.id;
        roomModel.creatorId = room.creator_id || null;
        roomModel.roomName = room.room_name;
        roomModel.statusFlag = room.status_flag;
        roomModel.remark = room.remark;
        roomModel.createTime = room.createTime;
        roomModel.updateTime = room.updateTime;
        roomModel.isDelete = room.isDelete;
        return roomModel;
    }
    /**
     * 获取房间中的用户信息
     * @param roomId
     */
    async selectUsersByRoomId(roomId) {
        const users = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('user.*')
            .from(room_user_1.RoomUserModel, 'room_user')
            .leftJoin(user_1.UserModel, 'user', 'user.id = room_user.user_id')
            .where('room_user.room_id = :roomId', { roomId: roomId })
            .getRawMany();
        // 将原始查询结果转换为UserModel对象
        return users.map(user => {
            const userModel = new user_1.UserModel();
            userModel.id = user.id;
            userModel.nickName = user.nick_name;
            userModel.avatar = user.avatar;
            userModel.sex = user.sex;
            userModel.createTime = user.createTime;
            userModel.updateTime = user.updateTime;
            return userModel;
        });
    }
    /**更新房间状态 */
    async updateRoomStatus(roomId, statusFlag) {
        const result = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(room_1.RoomModel)
            .set({ statusFlag: statusFlag })
            .where('id = :roomId', { roomId: roomId })
            .andWhere('isDelete = :isDelete', { isDelete: false })
            .execute();
        return result;
    }
    /**更新房间信息 */
    async updateRoom(roomId, roomData) {
        const result = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(room_1.RoomModel)
            .set({
            roomName: roomData.roomName,
            statusFlag: roomData.statusFlag,
            remark: roomData.remark,
        })
            .where('id = :roomId', { roomId: roomId })
            .andWhere('isDelete = :isDelete', { isDelete: false })
            .execute();
        return result;
    }
    /**软删除房间 */
    async deleteRoom(roomId) {
        const result = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(room_1.RoomModel)
            .set({ isDelete: true })
            .where('id = :roomId', { roomId: roomId })
            .execute();
        return result;
    }
    /**
     * 查询对局记录（分页）
     * @param params 查询参数
     * @returns 房间记录列表
     */
    async getGameRecords(params) {
        let query = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('r')
            .from(room_1.RoomModel, 'r')
            .where('r.isDelete = :isDelete', { isDelete: false });
        // 如果指定了用户ID，查询该用户参与的房间
        if (params.userId) {
            query = query
                .innerJoin('room_user', 'ru', 'ru.room_id = r.id')
                .andWhere('ru.user_id = :userId', { userId: params.userId });
        }
        // 如果指定了房间ID
        if (params.roomId) {
            query = query.andWhere('r.id = :roomId', { roomId: params.roomId });
        }
        const rooms = await query
            .orderBy('r.updateTime', 'DESC')
            .offset(params.offset)
            .limit(params.limit)
            .getMany();
        return rooms;
    }
    /**
     * 查询对局记录总数
     * @param params 查询参数
     * @returns 总记录数
     */
    async getGameRecordsCount(params) {
        let query = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('COUNT(DISTINCT r.id)', 'count')
            .from(room_1.RoomModel, 'r')
            .where('r.isDelete = :isDelete', { isDelete: false });
        // 如果指定了用户ID，查询该用户参与的房间
        if (params.userId) {
            query = query
                .innerJoin('room_user', 'ru', 'ru.room_id = r.id')
                .andWhere('ru.user_id = :userId', { userId: params.userId });
        }
        // 如果指定了房间ID
        if (params.roomId) {
            query = query.andWhere('r.id = :roomId', { roomId: params.roomId });
        }
        const result = await query.getRawOne();
        return parseInt(result.count) || 0;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], RoomRepository.prototype, "db", void 0);
exports.RoomRepository = RoomRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], RoomRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvcmVwb3NpdG9yeS9yb29tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0RDtBQUM1RCw0REFBd0U7QUFDeEUsd0NBQTBDO0FBQzFDLHdDQUEwQztBQUMxQyxrREFBbUQ7QUFFbkQsZUFBZTtBQUdSLElBQU0sY0FBYyw0QkFBcEIsTUFBTSxjQUFjO0lBRWpCLEVBQUUsQ0FBb0I7SUFFOUI7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFVO1FBQzNCLElBQUksRUFBRSxLQUFLLElBQUk7WUFBRSxPQUFPLElBQUksQ0FBQztRQUM3QixPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRTthQUMzQixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDZCxJQUFJLENBQUMsZ0JBQVMsRUFBRSxNQUFNLENBQUM7YUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQzthQUNsQyxNQUFNLEVBQUUsQ0FBQztRQUNaLElBQUksUUFBUTtZQUFFLE9BQU8sUUFBUSxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHNCQUFzQjtJQUN0QixLQUFLLENBQUMsY0FBYyxDQUFDLE1BQWM7UUFDakMsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRTthQUN4QixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDaEIsSUFBSSxDQUFDLHlCQUFhLEVBQUUsV0FBVyxDQUFDO2FBQ2hDLFFBQVEsQ0FBQyxnQkFBUyxFQUFFLE1BQU0sRUFBRSw2QkFBNkIsQ0FBQzthQUMx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