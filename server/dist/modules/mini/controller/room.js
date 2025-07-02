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
var RoomController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const core_1 = require("@midwayjs/core");
const api_1 = require("../../../framework/resp/api");
const room_1 = require("../service/room");
const transaction_1 = require("../service/transaction");
const redis_1 = require("../../../framework/datasource/redis/redis");
const sys_dict_data_1 = require("../../system/repository/sys_dict_data");
const axios_1 = require("axios");
/**
 * 房间信息
 *
 */
let RoomController = exports.RoomController = class RoomController {
    static { RoomController_1 = this; }
    /**房间服务 */
    roomService;
    /**交易服务 */
    transactionService;
    /**缓存服务 */
    redisCache;
    /**字典数据仓库 */
    sysDictDataRepository;
    /**access_token缓存 */
    static accessTokenCache = null;
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
            // 获取房间用户信息
            const users = await this.roomService.getRoomUsers(room.id);
            // 获取用户交易统计
            const userStats = await this.transactionService.getRoomUserStats(room.id);
            // 合并用户信息和交易统计
            const usersWithStats = users.map((user) => {
                const userStat = userStats.find(stat => stat.userId === user.id);
                return {
                    ...user,
                    totalPay: userStat ? userStat.totalPay : 0,
                    totalReceive: userStat ? userStat.totalReceive : 0,
                    netAmount: userStat ? userStat.netAmount : 0,
                };
            });
            let roomInfo = {
                ...room,
                users: usersWithStats,
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
    /**
     * 用户支付给房间内另一用户
     */
    async payToUser(data) {
        try {
            if (!data.roomId)
                return api_1.Resp.errMsg('房间ID不能为空');
            if (!data.payUserId)
                return api_1.Resp.errMsg('支付用户ID不能为空');
            if (!data.receiveUserId)
                return api_1.Resp.errMsg('收款用户ID不能为空');
            if (!data.amount || data.amount <= 0)
                return api_1.Resp.errMsg('支付金额必须大于0');
            const success = await this.transactionService.payToUser(data.roomId, data.payUserId, data.receiveUserId, data.amount);
            if (success) {
                return api_1.Resp.okMsg('支付成功');
            }
            else {
                return api_1.Resp.errMsg('支付失败');
            }
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '支付失败');
        }
    }
    /**
     * 获取房间交易记录
     */
    async getRoomTransactions(data) {
        try {
            if (!data.roomId)
                return api_1.Resp.errMsg('房间ID不能为空');
            let transactions;
            if (data.userId) {
                // 获取指定用户在房间内的交易记录
                transactions = await this.transactionService.getUserTransactionsInRoom(data.roomId, data.userId);
            }
            else {
                // 获取房间内所有交易记录
                transactions = await this.transactionService.getRoomTransactions(data.roomId);
            }
            return api_1.Resp.okData(transactions);
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '获取交易记录失败');
        }
    }
    /**
     * 获取房间交易统计和记录
     */
    async getRoomTransactionStats(data) {
        try {
            if (!data.roomId)
                return api_1.Resp.errMsg('房间ID不能为空');
            // 获取房间用户统计信息
            const userStats = await this.transactionService.getRoomUserStats(data.roomId);
            // 获取房间所有交易记录（包含用户信息）
            const transactions = await this.transactionService.getRoomTransactionsWithUserInfo(data.roomId);
            // 计算总体统计
            const totalStats = {
                totalTransactions: transactions.length,
                totalAmount: transactions.reduce((sum, t) => sum + t.payMoney, 0),
                totalUsers: userStats.length,
            };
            return api_1.Resp.okData({
                userStats,
                transactions,
                totalStats, // 总体统计
            });
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '获取交易统计失败');
        }
    }
    /**
     * 查询对局记录（分页）
     */
    async getGameRecords(data) {
        try {
            const page = data.page || 1;
            const pageSize = data.pageSize || 10;
            if (pageSize > 50) {
                return api_1.Resp.errMsg('每页最多查询50条记录');
            }
            const gameRecords = await this.roomService.getGameRecords({
                userId: data.userId,
                roomId: data.roomId,
                page,
                pageSize,
            });
            return api_1.Resp.okData(gameRecords);
        }
        catch (error) {
            return api_1.Resp.errMsg(error.message || '查询对局记录失败');
        }
    }
    /**
     * 生成小程序二维码
     */
    async generateQrcode(data) {
        if (!data.roomId)
            return api_1.Resp.errMsg('房间ID不能为空');
        // 验证房间是否存在
        const room = await this.roomService.getRoomById(data.roomId);
        if (!room)
            return api_1.Resp.errMsg('房间不存在');
        // 设置默认参数
        const path = `${data.path}`;
        const width = data.width || 430;
        // 获取微信小程序access_token
        const accessToken = await this.getWechatAccessToken();
        if (!accessToken) {
            return api_1.Resp.errMsg('获取微信访问令牌失败');
        }
        // 调用微信API生成小程序码
        const qrcodeUrl = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
        const response = await axios_1.default.post(qrcodeUrl, {
            scene: `roomId=${data.roomId}`,
            page: path,
            width: width,
            auto_color: false,
            line_color: { r: 0, g: 0, b: 0 },
            is_hyaline: false,
        }, {
            responseType: 'arraybuffer',
            timeout: 10000,
        });
        // 检查响应内容类型
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('image')) {
            // 成功返回图片数据
            const base64Image = Buffer.from(response.data).toString('base64');
            const imageDataUrl = `data:image/png;base64,${base64Image}`;
            return api_1.Resp.okData({
                qrcode: imageDataUrl,
                roomId: data.roomId,
                roomName: room.roomName,
                path: path,
                width: width,
            });
        }
        else {
            // 响应是错误信息（JSON格式）
            try {
                // 将arraybuffer转换为字符串，然后解析JSON
                const errorText = Buffer.from(response.data).toString('utf8');
                const errorInfo = JSON.parse(errorText);
                console.error('微信API错误:', errorInfo);
                // 根据错误码提供更友好的错误信息
                let errorMessage = '生成二维码失败';
                switch (errorInfo.errcode) {
                    case 40001:
                        errorMessage = 'access_token无效或已过期';
                        break;
                    case 41030:
                        errorMessage = '页面路径不正确';
                        break;
                    case 45009:
                        errorMessage = '接口调用超过限额';
                        break;
                    case 47001:
                        errorMessage = '参数错误';
                        break;
                    default:
                        errorMessage = errorInfo.errmsg || '未知错误';
                }
                return api_1.Resp.errMsg(`生成二维码失败: ${errorMessage} (错误码: ${errorInfo.errcode})`);
            }
            catch (parseError) {
                console.error('解析微信API错误响应失败:', parseError);
                console.error('原始响应数据:', response.data);
                return api_1.Resp.errMsg('生成二维码失败: 服务器响应格式错误');
            }
        }
    }
    /**
     * 获取微信小程序access_token
     */
    async getWechatAccessToken() {
        try {
            const cacheKey = 'wechat_access_token';
            const cacheValue = await this.redisCache.get('', cacheKey);
            // 检查缓存是否有效
            if (cacheValue) {
                return cacheValue;
            }
            let miniDict = await this.sysDictDataRepository.selectByPage({
                dictType: 'mini_appid_secret',
            });
            let miniConfig = JSON.parse(miniDict[0][0].dataValue);
            const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${miniConfig.appid}&secret=${miniConfig.secret}`;
            const response = await axios_1.default.get(tokenUrl, { timeout: 5000 });
            if (response.data.access_token) {
                await this.redisCache.set('', cacheKey, response.data.access_token, 2 * 60 * 60); // 缓存2小时
                return response.data.access_token;
            }
            else {
                console.error('获取access_token失败:', response.data);
                return null;
            }
        }
        catch (error) {
            console.error('获取微信access_token错误:', error);
            return null;
        }
    }
    /**
     * 清除access_token缓存（用于调试或强制刷新）
     */
    async clearTokenCache() {
        RoomController_1.accessTokenCache = null;
        console.log('access_token缓存已清除');
        return api_1.Resp.okMsg('缓存已清除');
    }
    /**
     * 获取access_token缓存状态（用于调试）
     */
    async getTokenCacheStatus() {
        if (!RoomController_1.accessTokenCache) {
            return api_1.Resp.okData({
                cached: false,
                message: '无缓存',
            });
        }
        const now = Date.now();
        const isValid = RoomController_1.accessTokenCache.expireTime > now;
        const remainingTime = Math.max(0, RoomController_1.accessTokenCache.expireTime - now);
        return api_1.Resp.okData({
            cached: true,
            valid: isValid,
            expireTime: new Date(RoomController_1.accessTokenCache.expireTime).toLocaleString(),
            remainingSeconds: Math.floor(remainingTime / 1000),
            token: RoomController_1.accessTokenCache.token.substring(0, 10) + '...', // 只显示前10位
        });
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", room_1.RoomService)
], RoomController.prototype, "roomService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", transaction_1.TransactionService)
], RoomController.prototype, "transactionService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], RoomController.prototype, "redisCache", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_data_1.SysDictDataRepository)
], RoomController.prototype, "sysDictDataRepository", void 0);
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
__decorate([
    (0, core_1.Post)('/pay'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "payToUser", null);
__decorate([
    (0, core_1.Post)('/transactions'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomTransactions", null);
__decorate([
    (0, core_1.Post)('/transaction-stats'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomTransactionStats", null);
__decorate([
    (0, core_1.Post)('/game-records'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getGameRecords", null);
__decorate([
    (0, core_1.Post)('/generate-qrcode'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "generateQrcode", null);
__decorate([
    (0, core_1.Post)('/clear-token-cache'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "clearTokenCache", null);
__decorate([
    (0, core_1.Post)('/token-cache-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getTokenCacheStatus", null);
exports.RoomController = RoomController = RoomController_1 = __decorate([
    (0, core_1.Controller)('/mini/room')
], RoomController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvY29udHJvbGxlci9yb29tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBZ0U7QUFDaEUscURBQW1EO0FBQ25ELDBDQUE4QztBQUM5Qyx3REFBNEQ7QUFDNUQscUVBQXVFO0FBQ3ZFLHlFQUE4RTtBQUM5RSxpQ0FBMEI7QUFFMUI7OztHQUdHO0FBRUksSUFBTSxjQUFjLDRCQUFwQixNQUFNLGNBQWM7O0lBQ3pCLFVBQVU7SUFFRixXQUFXLENBQWM7SUFFakMsVUFBVTtJQUVGLGtCQUFrQixDQUFxQjtJQUUvQyxVQUFVO0lBRUYsVUFBVSxDQUFhO0lBRS9CLFlBQVk7SUFFSixxQkFBcUIsQ0FBd0I7SUFFckQsb0JBQW9CO0lBQ1osTUFBTSxDQUFDLGdCQUFnQixHQUdwQixJQUFJLENBQUM7SUFFaEIsVUFBVTtJQUVHLEFBQU4sS0FBSyxDQUFDLE1BQU0sQ0FDVCxJQUE0QztRQUVwRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUFFLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUVuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUM1QyxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztZQUNGLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM5QjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0lBRUQsWUFBWTtJQUVDLEFBQU4sS0FBSyxDQUFDLFdBQVcsQ0FBUyxJQUF3QjtRQUN2RCxJQUFJO1lBQ0YsSUFBSSxD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