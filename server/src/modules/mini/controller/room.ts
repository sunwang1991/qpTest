import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { Resp } from '../../../framework/resp/api';
import { RoomService } from '../service/room';

/**
 * 房间信息
 *
 */
@Controller('/mini/room')
export class RoomController {
  /**房间服务 */
  @Inject()
  private roomService: RoomService;

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
      const users = await this.roomService.getRoomUsers(room.id);
      let roomInfo = {
        ...room,
        users,
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
}
