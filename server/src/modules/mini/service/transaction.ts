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
   * 获取房间交易记录（包含用户信息）
   * @param roomId 房间ID
   * @returns 包含用户信息的交易记录列表
   */
  async getRoomTransactionsWithUserInfo(roomId: number): Promise<any[]> {
    try {
      // 验证房间是否存在
      const room = await this.roomRepository.findRoomById(roomId);
      if (!room) {
        throw new Error('房间不存在');
      }

      // 获取交易记录
      const transactions = await this.transactionRepository.getRoomTransactions(
        roomId
      );

      // 获取房间所有用户信息
      const roomUsers = await this.roomRepository.selectUsersByRoomId(roomId);

      // 创建用户信息映射
      const userMap = new Map();
      roomUsers.forEach(user => {
        userMap.set(user.id, {
          id: user.id,
          nickName: user.nickName || '',
          avatar: user.avatar || '',
          sex: user.sex || '0',
        });
      });

      // 为每个交易记录添加用户信息
      const transactionsWithUserInfo = transactions.map(transaction => ({
        ...transaction,
        payUser: userMap.get(transaction.userId) || {
          id: transaction.userId,
          nickName: '未知用户',
          avatar: '',
          sex: '0',
        },
        receiveUser: userMap.get(transaction.receiveUserId) || {
          id: transaction.receiveUserId,
          nickName: '未知用户',
          avatar: '',
          sex: '0',
        },
      }));

      return transactionsWithUserInfo;
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

  /**
   * 获取用户战绩统计
   * @param userId 用户ID
   * @returns 用户战绩统计信息
   */
  async getUserGameStats(userId: number): Promise<any> {
    try {
      // 获取用户所有交易记录（作为收入）
      const receiveTransactions =
        await this.transactionRepository.getUserReceiveTransactions(userId);

      // 获取用户所有支付记录（作为支出）
      const payTransactions =
        await this.transactionRepository.getUserPayTransactions(userId);

      // 计算总收入
      const totalIncome = receiveTransactions.reduce(
        (sum, transaction) => sum + transaction.payMoney,
        0
      );

      // 计算总支出
      const totalExpense = payTransactions.reduce(
        (sum, transaction) => sum + transaction.payMoney,
        0
      );

      // 计算净收入
      const netIncome = totalIncome - totalExpense;

      // 计算总局数（参与的不同房间数）
      const allTransactions = [...receiveTransactions, ...payTransactions];
      const uniqueRooms = new Set(allTransactions.map(t => t.roomId));
      const totalGames = uniqueRooms.size;

      // 计算胜利场次（净收入为正的房间数）
      const roomStats = new Map();

      // 统计每个房间的净收支
      allTransactions.forEach(transaction => {
        const roomId = transaction.roomId;
        if (!roomStats.has(roomId)) {
          roomStats.set(roomId, { income: 0, expense: 0 });
        }

        if (transaction.receiveUserId === userId) {
          // 收入
          roomStats.get(roomId).income += transaction.payMoney;
        } else {
          // 支出
          roomStats.get(roomId).expense += transaction.payMoney;
        }
      });

      // 计算胜利场次（净收入为正的房间）
      let winGames = 0;
      roomStats.forEach(stat => {
        if (stat.income > stat.expense) {
          winGames++;
        }
      });

      // 计算胜率
      const winRate = totalGames > 0 ? (winGames / totalGames) * 100 : 0;

      return {
        totalIncome, // 总收入
        totalExpense, // 总支出
        netIncome, // 净收入
        totalGames, // 总局数
        winGames, // 胜利场次
        winRate: Math.round(winRate * 100) / 100, // 胜率（保留2位小数）
        loseGames: totalGames - winGames, // 失败场次
      };
    } catch (error) {
      throw error;
    }
  }
}
