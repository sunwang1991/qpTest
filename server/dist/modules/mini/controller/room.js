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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const core_1 = require("@midwayjs/core");
const api_1 = require("../../../framework/resp/api");
const room_1 = require("../service/room");
/**
 * 房间信息
 *
 */
let RoomController = exports.RoomController = class RoomController {
    /**房间服务 */
    roomService;
    /**创建房间 */
    async create(data) {
        try {
            if (!data.creator)
                return api_1.Resp.errMsg('创建者ID不能为空');
            const roomInfo = await this.roomService.create(data.creator, data.roomName);
            return api_1.Resp.okData(roomInfo);
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '创建房间失败');
        }
    }
    /**获取房间信息 */
    async getRoomInfo(data) {
        try {
            if (!data.roomId)
                return api_1.Resp.errMsg('房间ID不能为空');
            const roomInfo = await this.roomService.getRoomById(data.roomId);
            if (!roomInfo)
                return api_1.Resp.errMsg('房间不存在');
            return api_1.Resp.okData(roomInfo);
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '获取房间信息失败');
        }
    }
    /**获取用户的所有房间 */
    async getUserRooms(data) {
        try {
            if (!data.userId)
                return api_1.Resp.errMsg('用户ID不能为空');
            const rooms = await this.roomService.getUserRooms(data.userId);
            return api_1.Resp.okData(rooms);
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '获取用户房间列表失败');
        }
    }
    /**获取用户当前进行中的房间 */
    async getUserActiveRoom(data) {
        try {
            if (!data.userId)
                return api_1.Resp.errMsg('用户ID不能为空');
            const room = await this.roomService.getUserActiveRoom(data.userId);
            if (!room)
                return api_1.Resp.errMsg('用户没有进行中的房间');
            const users = await this.roomService.getRoomUsers(room.id);
            let roomInfo = {
                ...room,
                users,
            };
            return api_1.Resp.okData(roomInfo);
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '获取用户活跃房间失败');
        }
    }
    /**结束房间 */
    async finishRoom(data) {
        try {
            if (!data.roomId)
                return api_1.Resp.errMsg('房间ID不能为空');
            if (!data.userId)
                return api_1.Resp.errMsg('用户ID不能为空');
            const success = await this.roomService.finishRoom(data.roomId, data.userId);
            if (success) {
                return api_1.Resp.okMsg('房间已结束');
            }
            else {
                return api_1.Resp.errMsg('结束房间失败');
            }
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '结束房间失败');
        }
    }
    /**更新房间信息 */
    async updateRoom(data) {
        try {
            if (!data.roomId)
                return api_1.Resp.errMsg('房间ID不能为空');
            if (!data.userId)
                return api_1.Resp.errMsg('用户ID不能为空');
            const success = await this.roomService.updateRoom(data.roomId, data.userId, { roomName: data.roomName, remark: data.remark });
            if (success) {
                return api_1.Resp.okMsg('房间信息更新成功');
            }
            else {
                return api_1.Resp.errMsg('更新房间信息失败');
            }
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '更新房间信息失败');
        }
    }
    /**删除房间 */
    async deleteRoom(data) {
        try {
            if (!data.roomId)
                return api_1.Resp.errMsg('房间ID不能为空');
            if (!data.userId)
                return api_1.Resp.errMsg('用户ID不能为空');
            const success = await this.roomService.deleteRoom(data.roomId, data.userId);
            if (success) {
                return api_1.Resp.okMsg('房间删除成功');
            }
            else {
                return api_1.Resp.errMsg('删除房间失败');
            }
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '删除房间失败');
        }
    }
    /**
     * 加入房间
     */
    async joinRoom(data) {
        try {
            if (!data.roomId)
                return api_1.Resp.errMsg('房间ID不能为空');
            if (!data.userId)
                return api_1.Resp.errMsg('用户ID不能为空');
            const success = await this.roomService.joinRoom(data.userId, data.roomId);
            if (success) {
                return api_1.Resp.okMsg('加入房间成功');
            }
            else {
                return api_1.Resp.errMsg('加入房间失败');
            }
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '加入房间失败');
        }
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", room_1.RoomService)
], RoomController.prototype, "roomService", void 0);
__decorate([
    (0, core_1.Post)('/create'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "create", null);
__decorate([
    (0, core_1.Post)('/info'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomInfo", null);
__decorate([
    (0, core_1.Post)('/user-rooms'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getUserRooms", null);
__decorate([
    (0, core_1.Post)('/active-room'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getUserActiveRoom", null);
__decorate([
    (0, core_1.Post)('/finish'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "finishRoom", null);
__decorate([
    (0, core_1.Post)('/update'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "updateRoom", null);
__decorate([
    (0, core_1.Post)('/delete'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "deleteRoom", null);
__decorate([
    (0, core_1.Post)('/join'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "joinRoom", null);
exports.RoomController = RoomController = __decorate([
    (0, core_1.Controller)('/mini/room')
], RoomController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvY29udHJvbGxlci9yb29tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFnRTtBQUNoRSxxREFBbUQ7QUFDbkQsMENBQThDO0FBRTlDOzs7R0FHRztBQUVJLElBQU0sY0FBYyw0QkFBcEIsTUFBTSxjQUFjO0lBQ3pCLFVBQVU7SUFFRixXQUFXLENBQWM7SUFFakMsVUFBVTtJQUVHLEFBQU4sS0FBSyxDQUFDLE1BQU0sQ0FDVCxJQUE0QztRQUVwRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUFFLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUVuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUM1QyxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztZQUNGLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM5QjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0lBRUQsWUFBWTtJQUVDLEFBQU4sS0FBSyxDQUFDLFdBQVcsQ0FBUyxJQUF3QjtRQUN2RCxJQUFJO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVqRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFPLFVBQUksQ0FBQyxN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