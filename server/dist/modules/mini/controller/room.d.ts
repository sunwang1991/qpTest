import { Resp } from '../../../framework/resp/api';
/**
 * 房间信息
 *
 */
export declare class RoomController {
    /**房间服务 */
    private roomService;
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
}
