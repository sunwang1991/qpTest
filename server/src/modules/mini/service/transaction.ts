import { Inject, Provide, Singleton } from '@midwayjs/core';
import { TransactionRepository } from '../repository/transaction';
import { RoomRepository } from '../repository/room';
import { TransactionModel } from '../model/transaction';

/**
 * 交易记录 服务层处理
 */
@Provide()
@Singleton()
export class TransactionService {
  @Inject()
  private transactionRepository: TransactionRepository;

  @Inject()
  private roomRepository: RoomRepository;

  /**
   * 用户支付给另一用户
   * @param roomId 房间ID
   * @param payUserId 支付用户ID
   * @param receiveUserId 收款用户ID
   * @param amount 支付金额
   * @returns 是否成功
   */
  async payToUser(
    roomId: number,
    payUserId: number,
    receiveUserId: number,
    amount: number
  ): Promise<boolean> {
    try {
      // 验证房间是否存在且为正常状态
      const room = await this.roomRepository.findRoomById(roomId);
      if (!room || room.statusFlag !== '1') {
        throw new Error('房间不存在或已结束');
      }

      // 验证支付用户和收款用户不能相同
      if (payUserId === receiveUserId) {
        throw new Error('不能向自己支付');
      }

      // 验证金额必须大于0
      if (amount <= 0) {
        throw new Error('支付金额必须大于0');
      }

      // 验证用户是否都在房间内
      const roomUsers = await this.roomRepository.selectUsersByRoomId(roomId);
      const userIds = roomUsers.map((user: any) => user.id);

      if (!userIds.includes(payUserId)) {
        throw new Error('支付用户不在房间内');
      }

      if (!userIds.includes(receiveUserId)) {
        throw new Error('收款用户不在房间内');
      }

      // 创建交易记录
      const transactionData: Partial<TransactionModel> = {
        roomId,
        userId: payUserId,
        receiveUserId,
        payMoney: amount,
      };

      const result = await this.transactionRepository.insertTransaction(
        transactionData
      );
      return result.raw.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取房间用户交易统计
   * @param roomId 房间ID
   * @returns 用户交易统计列表
   */
  async getRoomUserStats(roomId: number): Promise<any[]> {
    try {
      // 验证房间是否存在
      const room = await this.roomRepository.findRoomById(roomId);
      if (!room) {
        throw new Error('房间不存在');
      }

      // 获取房间用户信息
      const roomUsers = await this.roomRepository.selectUsersByRoomId(roomId);

      // 获取交易统计
      const transactionStats =
        await this.transactionRepository.getRoomUserTransactionStats(roomId);

      // 合并用户信息和交易统计
      const result = roomUsers.map((user: any) => {
        const userStat = transactionStats.find(stat => stat.userId === user.id);
        return {
          userId: user.id,
          nickName: user.nickName || '',
          avatar: user.avatar || '',
          totalPay: userStat ? userStat.totalPay : 0,
          totalReceive: userStat ? userStat.totalReceive : 0,
          netAmount: userStat ? userStat.netAmount : 0,
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取房间所有交易记录
   * @param roomId 房间ID
   * @returns 交易记录列表
   */
  async getRoomTransactions(roomId: number): Promise<TransactionModel[]> {
    try {
      // 验证房间是否存在
      const room = await this.roomRepository.findRoomById(roomId);
      if (!room) {
        throw new Error('房间不存在');
      }

      return await this.transactionRepository.getRoomTransactions(roomId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取用户在房间内的交易记录
   * @param roomId 房间ID
   * @param userId 用户ID
   * @returns 交易记录列表
   */
  async getUserTransactionsInRoom(
    roomId: number,
    userId: number
  ): Promise<TransactionModel[]> {
    try {
      // 验证房间是否存在
      const room = await this.roomRepository.findRoomById(roomId);
      if (!room) {
        throw new Error('房间不存在');
      }

      // 验证用户是否在房间内
      const roomUsers = await this.roomRepository.selectUsersByRoomId(roomId);
      const userIds = roomUsers.map((user: any) => user.id);

      if (!userIds.includes(userId)) {
        throw new Error('用户不在房间内');
      }

      return await this.transactionRepository.getUserTransactionsInRoom(
        roomId,
        userId
      );
    } catch (error) {
      throw error;
    }
  }
}
