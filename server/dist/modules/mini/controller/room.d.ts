import { Resp } from '../../../framework/resp/api';
/**
 * 房间信息
 *
 */
export declare class RoomController {
    /**房间服务 */
    private roomService;
    /**交易服务 */
    private transactionService;
    /**缓存服务 */
    private redisCache;
    /**字典数据仓库 */
    private sysDictDataRepository;
    /**access_token缓存 */
    private static accessTokenCache;
    /**创建房间 */
    create(data: {
        creator: number;
        roomName?: string;
    }): Promise<Resp>;
    /**获取房间信息 */
    getRoomInfo(data: {
        roomId: number;
    }): Promise<Resp>;
    /**获取用户的所有房间 */
    getUserRooms(data: {
        userId: number;
    }): Promise<Resp>;
    /**获取用户当前进行中的房间 */
    getUserActiveRoom(data: {
        userId: number;
    }): Promise<Resp>;
    /**结束房间 */
    finishRoom(data: {
        roomId: number;
        userId: number;
    }): Promise<Resp>;
    /**更新房间信息 */
    updateRoom(data: {
        roomId: number;
        userId: number;
        roomName?: string;
        remark?: string;
    }): Promise<Resp>;
    /**删除房间 */
    deleteRoom(data: {
        roomId: number;
        userId: number;
    }): Promise<Resp>;
    /**
     * 加入房间
     */
    joinRoom(data: {
        roomId: number;
        userId: number;
    }): Promise<Resp>;
    /**
     * 用户支付给房间内另一用户
     */
    payToUser(data: {
        roomId: number;
        payUserId: number;
        receiveUserId: number;
        amount: number;
    }): Promise<Resp>;
    /**
     * 获取房间交易记录
     */
    getRoomTransactions(data: {
        roomId: number;
        userId?: number;
    }): Promise<Resp>;
    /**
     * 获取房间交易统计和记录
     */
    getRoomTransactionStats(data: {
        roomId: number;
    }): Promise<Resp>;
    /**
     * 查询对局记录（分页）
     */
    getGameRecords(data: {
        userId?: number;
        page?: number;
        pageSize?: number;
        roomId?: number;
    }): Promise<Resp>;
    /**
     * 生成小程序二维码
     */
    generateQrcode(data: {
        roomId: number;
        path?: string;
        width?: number;
    }): Promise<Resp>;
    /**
     * 获取微信小程序access_token
     */
    private getWechatAccessToken;
    /**
     * 清除access_token缓存（用于调试或强制刷新）
     */
    clearTokenCache(): Promise<Resp>;
    /**
     * 获取access_token缓存状态（用于调试）
     */
    getTokenCacheStatus(): Promise<Resp>;
}
