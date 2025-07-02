import { RoomModel } from '../model/room';
import { UserModel } from '../model/user';
/**房间表 数据层处理 */
export declare class RoomRepository {
    private db;
    /**
     * 通过房间Id查找房间
     * @param id
     */
    findRoomById(id: number): Promise<RoomModel>;
    /**通过用户Id查找所有存在过的房间 */
    selectByUserId(userId: number): Promise<RoomModel[]>;
    /**
     * 通过房间Id数组查找所有房间
     * @param rooms
     */
    selectRooms(rooms: Array<number>): Promise<RoomModel[]>;
    /**新增房间 */
    insertRoom(roomData: Partial<RoomModel>): Promise<import("typeorm").InsertResult>;
    /**新增房间用户关联 */
    insertRoomUser(roomId: number, userId: number): Promise<import("typeorm").InsertResult>;
    /**查找用户的进行中房间 */
    findActiveRoomByUserId(userId: number): Promise<RoomModel | null>;
    /**
     * 获取房间中的用户信息
     * @param roomId
     */
    selectUsersByRoomId(roomId: number): Promise<UserModel[]>;
    /**更新房间状态 */
    updateRoomStatus(roomId: number, statusFlag: string): Promise<import("typeorm").UpdateResult>;
    /**更新房间信息 */
    updateRoom(roomId: number, roomData: Partial<RoomModel>): Promise<import("typeorm").UpdateResult>;
    /**软删除房间 */
    deleteRoom(roomId: number): Promise<import("typeorm").UpdateResult>;
    /**
     * 查询对局记录（分页）
     * @param params 查询参数
     * @returns 房间记录列表
     */
    getGameRecords(params: {
        userId?: number;
        roomId?: number;
        offset: number;
        limit: number;
    }): Promise<RoomModel[]>;
    /**
     * 查询对局记录总数
     * @param params 查询参数
     * @returns 总记录数
     */
    getGameRecordsCount(params: {
        userId?: number;
        roomId?: number;
    }): Promise<number>;
}
