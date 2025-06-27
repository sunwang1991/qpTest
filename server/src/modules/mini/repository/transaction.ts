import { Inject, Provide, Singleton } from '@midwayjs/core';
import { InsertResult } from 'typeorm';
import { DynamicDataSource } from '../../../framework/datasource/db/db';
import { TransactionModel } from '../model/transaction';

/**交易记录表 数据层处理 */
@Provide()
@Singleton()
export class TransactionRepository {
  @Inject()
  private db: DynamicDataSource;

  /**
   * 插入交易记录
   * @param transactionData 交易数据
   * @returns 插入结果
   */
  async insertTransaction(transactionData: Partial<TransactionModel>): Promise<InsertResult> {
    const result = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .insert()
      .into(TransactionModel)
      .values({
        roomId: transactionData.roomId,
        userId: transactionData.userId,
        receiveUserId: transactionData.receiveUserId,
        payMoney: transactionData.payMoney,
      })
      .execute();
    return result;
  }

  /**
   * 查询房间内用户的交易统计
   * @param roomId 房间ID
   * @returns 用户交易统计列表
   */
  async getRoomUserTransactionStats(roomId: number): Promise<any[]> {
    // 查询支出统计
    const payStats = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('t.user_id', 'userId')
      .addSelect('SUM(t.pay_money)', 'totalPay')
      .from(TransactionModel, 't')
      .where('t.room_id = :roomId', { roomId })
      .groupBy('t.user_id')
      .getRawMany();

    // 查询收入统计
    const receiveStats = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('t.receive_user_id', 'userId')
      .addSelect('SUM(t.pay_money)', 'totalReceive')
      .from(TransactionModel, 't')
      .where('t.room_id = :roomId', { roomId })
      .groupBy('t.receive_user_id')
      .getRawMany();

    // 合并统计数据
    const statsMap = new Map();
    
    // 处理支出数据
    payStats.forEach(stat => {
      const userId = stat.userId;
      if (!statsMap.has(userId)) {
        statsMap.set(userId, { userId, totalPay: 0, totalReceive: 0 });
      }
      statsMap.get(userId).totalPay = parseFloat(stat.totalPay) || 0;
    });

    // 处理收入数据
    receiveStats.forEach(stat => {
      const userId = stat.userId;
      if (!statsMap.has(userId)) {
        statsMap.set(userId, { userId, totalPay: 0, totalReceive: 0 });
      }
      statsMap.get(userId).totalReceive = parseFloat(stat.totalReceive) || 0;
    });

    // 计算净输赢
    const result = Array.from(statsMap.values()).map(stat => ({
      userId: stat.userId,
      totalPay: stat.totalPay,
      totalReceive: stat.totalReceive,
      netAmount: stat.totalReceive - stat.totalPay, // 正数表示赢钱，负数表示输钱
    }));

    return result;
  }

  /**
   * 查询房间内所有交易记录
   * @param roomId 房间ID
   * @returns 交易记录列表
   */
  async getRoomTransactions(roomId: number): Promise<TransactionModel[]> {
    const transactions = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('t')
      .from(TransactionModel, 't')
      .where('t.room_id = :roomId', { roomId })
      .orderBy('t.createTime', 'DESC')
      .getMany();
    return transactions;
  }

  /**
   * 查询用户在房间内的交易记录
   * @param roomId 房间ID
   * @param userId 用户ID
   * @returns 交易记录列表
   */
  async getUserTransactionsInRoom(roomId: number, userId: number): Promise<TransactionModel[]> {
    const transactions = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('t')
      .from(TransactionModel, 't')
      .where('t.room_id = :roomId', { roomId })
      .andWhere('(t.user_id = :userId OR t.receive_user_id = :userId)', { userId })
      .orderBy('t.createTime', 'DESC')
      .getMany();
    return transactions;
  }
}
