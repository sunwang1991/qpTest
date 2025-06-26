import { Inject, Provide, Singleton } from '@midwayjs/core';
import { DynamicDataSource } from '../../../framework/datasource/db/db';
import { RoomModel } from '../model/room';
import { UserModel } from '../model/user';
import { RoomUserModel } from '../model/room_user';

/**房间表 数据层处理 */
@Provide()
@Singleton()
export class RoomRepository {
  @Inject()
  private db: DynamicDataSource;

  /**
   * 通过房间Id查找房间
   * @param id
   */
  async findRoomById(id: number) {
    if (id === null) return null;
    // 查询数据
    const roomInfo = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('room')
      .from(RoomModel, 'room')
      .where('room.id = :id', { id: id })
      .getOne();
    if (roomInfo) return roomInfo;
    return null;
  }

  /**通过用户Id查找所有存在过的房间 */
  async selectByUserId(userId: number): Promise<RoomModel[]> {
    const rooms = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('room.*')
      .from(RoomUserModel, 'room_user')
      .leftJoin(RoomModel, 'room', 'room.id = room_user.room_id')
      .where('room_user.user_id = :userId', { userId: userId })
      .andWhere('room.isDelete = :isDelete', { isDelete: false })
      .getRawMany();

    // 将原始查询结果转换为RoomModel对象
    return rooms.map(room => {
      const roomModel = new RoomModel();
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
  async selectRooms(rooms: Array<number>) {
    const roomList = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('room')
      .from(RoomModel, 'room')
      .where('room.id IN (:...ids)', { ids: rooms })
      .getMany();
    return roomList;
  }

  /**新增房间 */
  async insertRoom(roomData: Partial<RoomModel>) {
    const room = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .insert()
      .into(RoomModel)
      .values({
        creatorId: roomData.creatorId,
        roomName: roomData.roomName || '新房间',
        statusFlag: roomData.statusFlag || '1', // 默认正常状态
        remark: roomData.remark || '',
        isDelete: false,
      })
      .execute();
    return room;
  }

  /**新增房间用户关联 */
  async insertRoomUser(roomId: number, userId: number) {
    const roomUser = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .insert()
      .into(RoomUserModel)
      .values({
        roomId: Number(roomId),
        userId: Number(userId), // 确保转换为数字类型
      })
      .execute();
    return roomUser;
  }

  /**查找用户的进行中房间 */
  async findActiveRoomByUserId(userId: number): Promise<RoomModel | null> {
    const room = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('room.*')
      .from(RoomUserModel, 'room_user')
      .leftJoin(RoomModel, 'room', 'room.id = room_user.room_id')
      .where('room_user.user_id = :userId', { userId: userId })
      .andWhere('room.status_flag = :statusFlag', { statusFlag: '1' }) // 正常状态
      .andWhere('room.isDelete = :isDelete', { isDelete: false })
      .getRawOne();

    if (!room) return null;

    // 将原始查询结果转换为RoomModel对象
    const roomModel = new RoomModel();
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
  async selectUsersByRoomId(roomId: number) {
    const users = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('user.*')
      .from(RoomUserModel, 'room_user')
      .leftJoin(UserModel, 'user', 'user.id = room_user.user_id')
      .where('room_user.room_id = :roomId', { roomId: roomId })
      .getRawMany();

    // 将原始查询结果转换为UserModel对象
    return users.map(user => {
      const userModel = new UserModel();
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
  async updateRoomStatus(roomId: number, statusFlag: string) {
    const result = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .update(RoomModel)
      .set({ statusFlag: statusFlag })
      .where('id = :roomId', { roomId: roomId })
      .andWhere('isDelete = :isDelete', { isDelete: false })
      .execute();
    return result;
  }

  /**更新房间信息 */
  async updateRoom(roomId: number, roomData: Partial<RoomModel>) {
    const result = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .update(RoomModel)
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
  async deleteRoom(roomId: number) {
    const result = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .update(RoomModel)
      .set({ isDelete: true })
      .where('id = :roomId', { roomId: roomId })
      .execute();
    return result;
  }
}
