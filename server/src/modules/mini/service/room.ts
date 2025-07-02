import { Inject, Provide } from '@midwayjs/core';
import { RoomModel } from '../model/room';
import { RoomRepository } from '../repository/room';
import { TransactionRepository } from '../repository/transaction';
import { ResultSetHeader } from 'mysql2';

/**
 * 房间信息 服务层处理
 */
@Provide()
export class RoomService {
  @Inject()
  private roomRepository: RoomRepository;

  @Inject()
  private transactionRepository: TransactionRepository;

  /**
   * 创建房间
   * @param creator 创建者ID
   * @param roomName 房间名称（可选）
   * @returns 房间信息
   */
  async create(creator: number, roomName?: string): Promise<RoomModel> {
    // 检查用户是否已有进行中的房间
    const activeRoom = await this.roomRepository.findActiveRoomByUserId(
      creator
    );
    if (activeRoom) return activeRoom;

    // 创建房间数据
    const roomData: Partial<RoomModel> = {
      creatorId: creator,
      roomName: roomName || `房间_${Date.now()}`,
      statusFlag: '1', // 正常状态
      remark: '',
    };

    // 插入房间记录
    const insertResult = await this.roomRepository.insertRoom(roomData);
    const raw: ResultSetHeader = insertResult.raw;

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
  async getRoomById(roomId: number): Promise<RoomModel | null> {
    return await this.roomRepository.findRoomById(roomId);
  }

  /**
   * 获取用户的所有房间
   * @param userId 用户ID
   * @returns 房间列表
   */
  async getUserRooms(userId: number): Promise<RoomModel[]> {
    return await this.roomRepository.selectByUserId(userId);
  }

  /**
   * 获取用户当前进行中的房间
   * @param userId 用户ID
   * @returns 房间信息或null
   */
  async getUserActiveRoom(userId: number): Promise<RoomModel | null> {
    return await this.roomRepository.findActiveRoomByUserId(userId);
  }

  /**
   * 获取房间内所有用户
   * @param roomId 房间ID
   * @returns 用户列表
   */
  async getRoomUsers(roomId: number): Promise<Object[]> {
    return await this.roomRepository.selectUsersByRoomId(roomId);
  }

  /**
   * 结束房间（设置为已结算状态）
   * @param roomId 房间ID
   * @param userId 操作用户ID（验证权限）
   * @returns 是否成功
   */
  async finishRoom(roomId: number, userId: number): Promise<boolean> {
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
  async updateRoom(
    roomId: number,
    userId: number,
    roomData: { roomName?: string; remark?: string }
  ): Promise<boolean> {
    // 验证房间是否存在且用户有权限操作
    const room = await this.roomRepository.findRoomById(roomId);
    if (!room) {
      throw new Error('房间不存在');
    }

    if (room.creatorId !== userId) {
      throw new Error('只有房间创建者可以修改房间信息');
    }

    // 更新房间信息
    const updateData: Partial<RoomModel> = {
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
  async deleteRoom(roomId: number, userId: number): Promise<boolean> {
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
  async joinRoom(userId: number, roomId: number): Promise<RoomModel> {
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
  async getGameRecords(params: {
    userId?: number;
    roomId?: number;
    page: number;
    pageSize: number;
  }): Promise<any> {
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
      const gameRecordsWithStats = await Promise.all(
        rooms.map(async (room: any) => {
          // 获取房间成员
          const roomUsers = await this.roomRepository.selectUsersByRoomId(
            room.id
          );

          // 获取房间交易统计
          const transactionStats =
            await this.transactionRepository.getRoomUserTransactionStats(
              room.id
            );

          // 合并用户信息和交易统计
          const membersIncome = roomUsers.map((user: any) => {
            const userStat = transactionStats.find(
              stat => stat.userId === user.id
            );
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
          const totalTransactionAmount = transactionStats.reduce(
            (sum, stat) => sum + stat.totalPay,
            0
          );

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
        })
      );

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
    } catch (error) {
      throw error;
    }
  }
}
