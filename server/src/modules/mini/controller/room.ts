import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { Resp } from '../../../framework/resp/api';
import { RoomService } from '../service/room';
import { TransactionService } from '../service/transaction';

/**
 * 房间信息
 *
 */
@Controller('/mini/room')
export class RoomController {
  /**房间服务 */
  @Inject()
  private roomService: RoomService;

  /**交易服务 */
  @Inject()
  private transactionService: TransactionService;

  /**创建房间 */
  @Post('/create')
  public async create(
    @Body() data: { creator: number; roomName?: string }
  ): Promise<Resp> {
    try {
      if (!data.creator) return Resp.errMsg('创建者ID不能为空');

      const roomInfo = await this.roomService.create(
        data.creator,
        data.roomName
      );
      return Resp.okData(roomInfo);
    } catch (error) {
      return Resp.errMsg(error.message || '创建房间失败');
    }
  }

  /**获取房间信息 */
  @Post('/info')
  public async getRoomInfo(@Body() data: { roomId: number }): Promise<Resp> {
    try {
      if (!data.roomId) return Resp.errMsg('房间ID不能为空');

      const roomInfo = await this.roomService.getRoomById(data.roomId);
      if (!roomInfo) return Resp.errMsg('房间不存在');

      return Resp.okData(roomInfo);
    } catch (error) {
      return Resp.errMsg(error.message || '获取房间信息失败');
    }
  }

  /**获取用户的所有房间 */
  @Post('/user-rooms')
  public async getUserRooms(@Body() data: { userId: number }): Promise<Resp> {
    try {
      if (!data.userId) return Resp.errMsg('用户ID不能为空');

      const rooms = await this.roomService.getUserRooms(data.userId);
      return Resp.okData(rooms);
    } catch (error) {
      return Resp.errMsg(error.message || '获取用户房间列表失败');
    }
  }

  /**获取用户当前进行中的房间 */
  @Post('/active-room')
  public async getUserActiveRoom(
    @Body() data: { userId: number }
  ): Promise<Resp> {
    try {
      if (!data.userId) return Resp.errMsg('用户ID不能为空');

      const room = await this.roomService.getUserActiveRoom(data.userId);
      if (!room) return Resp.errMsg('用户没有进行中的房间');

      // 获取房间用户信息
      const users = await this.roomService.getRoomUsers(room.id);

      // 获取用户交易统计
      const userStats = await this.transactionService.getRoomUserStats(room.id);

      // 合并用户信息和交易统计
      const usersWithStats = users.map((user: any) => {
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
      return Resp.okData(roomInfo);
    } catch (error) {
      return Resp.errMsg(error.message || '获取用户活跃房间失败');
    }
  }

  /**结束房间 */
  @Post('/finish')
  public async finishRoom(
    @Body() data: { roomId: number; userId: number }
  ): Promise<Resp> {
    try {
      if (!data.roomId) return Resp.errMsg('房间ID不能为空');
      if (!data.userId) return Resp.errMsg('用户ID不能为空');

      const success = await this.roomService.finishRoom(
        data.roomId,
        data.userId
      );
      if (success) {
        return Resp.okMsg('房间已结束');
      } else {
        return Resp.errMsg('结束房间失败');
      }
    } catch (error) {
      return Resp.errMsg(error.message || '结束房间失败');
    }
  }

  /**更新房间信息 */
  @Post('/update')
  public async updateRoom(
    @Body()
    data: {
      roomId: number;
      userId: number;
      roomName?: string;
      remark?: string;
    }
  ): Promise<Resp> {
    try {
      if (!data.roomId) return Resp.errMsg('房间ID不能为空');
      if (!data.userId) return Resp.errMsg('用户ID不能为空');

      const success = await this.roomService.updateRoom(
        data.roomId,
        data.userId,
        { roomName: data.roomName, remark: data.remark }
      );

      if (success) {
        return Resp.okMsg('房间信息更新成功');
      } else {
        return Resp.errMsg('更新房间信息失败');
      }
    } catch (error) {
      return Resp.errMsg(error.message || '更新房间信息失败');
    }
  }

  /**删除房间 */
  @Post('/delete')
  public async deleteRoom(
    @Body() data: { roomId: number; userId: number }
  ): Promise<Resp> {
    try {
      if (!data.roomId) return Resp.errMsg('房间ID不能为空');
      if (!data.userId) return Resp.errMsg('用户ID不能为空');

      const success = await this.roomService.deleteRoom(
        data.roomId,
        data.userId
      );
      if (success) {
        return Resp.okMsg('房间删除成功');
      } else {
        return Resp.errMsg('删除房间失败');
      }
    } catch (error) {
      return Resp.errMsg(error.message || '删除房间失败');
    }
  }

  /**
   * 加入房间
   */
  @Post('/join')
  public async joinRoom(
    @Body() data: { roomId: number; userId: number }
  ): Promise<Resp> {
    try {
      if (!data.roomId) return Resp.errMsg('房间ID不能为空');
      if (!data.userId) return Resp.errMsg('用户ID不能为空');

      const success = await this.roomService.joinRoom(data.userId, data.roomId);
      if (success) {
        return Resp.okMsg('加入房间成功');
      } else {
        return Resp.errMsg('加入房间失败');
      }
    } catch (error) {
      return Resp.errMsg(error.message || '加入房间失败');
    }
  }

  /**
   * 用户支付给房间内另一用户
   */
  @Post('/pay')
  public async payToUser(
    @Body()
    data: {
      roomId: number;
      payUserId: number;
      receiveUserId: number;
      amount: number;
    }
  ): Promise<Resp> {
    try {
      if (!data.roomId) return Resp.errMsg('房间ID不能为空');
      if (!data.payUserId) return Resp.errMsg('支付用户ID不能为空');
      if (!data.receiveUserId) return Resp.errMsg('收款用户ID不能为空');
      if (!data.amount || data.amount <= 0)
        return Resp.errMsg('支付金额必须大于0');

      const success = await this.transactionService.payToUser(
        data.roomId,
        data.payUserId,
        data.receiveUserId,
        data.amount
      );

      if (success) {
        return Resp.okMsg('支付成功');
      } else {
        return Resp.errMsg('支付失败');
      }
    } catch (error) {
      return Resp.errMsg(error.message || '支付失败');
    }
  }
}
