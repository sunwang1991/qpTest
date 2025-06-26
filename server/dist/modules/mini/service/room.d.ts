import { RoomModel } from '../model/room';
/**
 * 房间信息 服务层处理
 */
export declare class RoomService {
    private roomRepository;
    /**
     * 创建房间
     * @param creator 创建者ID
     * @param roomName 房间名称（可选）
     * @returns 房间信息
     */
    create(creator: number, roomName?: string): Promise<RoomModel>;
    /**
     * 根据房间ID获取房间信息
     * @param roomId 房间ID
     * @returns 房间信息
     */
    getRoomById(roomId: number): Promise<RoomModel | null>;
    /**
     * 获取用户的所有房间
     * @param userId 用户ID
     * @returns 房间列表
     */
    getUserRooms(userId: number): Promise<RoomModel[]>;
    /**
     * 获取用户当前进行中的房间
     * @param userId 用户ID
     * @returns 房间信息或null
     */
    getUserActiveRoom(userId: number): Promise<RoomModel | null>;
    /**
     * 获取房间内所有用户
     * @param roomId 房间ID
     * @returns 用户列表
     */
    getRoomUsers(roomId: number): Promise<Object[]>;
    /**
     * 结束房间（设置为已结算状态）
     * @param roomId 房间ID
     * @param userId 操作用户ID（验证权限）
     * @returns 是否成功
     */
    finishRoom(roomId: number, userId: number): Promise<boolean>;
    /**
     * 更新房间信息
     * @param roomId 房间ID
     * @param userId 操作用户ID（验证权限）
     * @param roomData 房间数据
     * @returns 是否成功
     */
    updateRoom(roomId: number, userId: number, roomData: {
        roomName?: string;
        remark?: string;
    }): Promise<boolean>;
    /**
     * 删除房间（软删除）
     * @param roomId 房间ID
     * @param userId 操作用户ID（验证权限）
     * @returns 是否成功
     */
    deleteRoom(roomId: number, userId: number): Promise<boolean>;
    /**
     * 加入房间
     */
    joinRoom(userId: number, roomId: number): Promise<RoomModel>;
}
