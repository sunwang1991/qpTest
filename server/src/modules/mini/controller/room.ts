import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { Resp } from '../../../framework/resp/api';
import { RoomService } from '../service/room';
import { TransactionService } from '../service/transaction';
import { RedisCache } from '../../../framework/datasource/redis/redis';
import { SysDictDataRepository } from '../../system/repository/sys_dict_data';
import axios from 'axios';

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

  /**缓存服务 */
  @Inject()
  private redisCache: RedisCache;

  /**字典数据仓库 */
  @Inject()
  private sysDictDataRepository: SysDictDataRepository;

  /**access_token缓存 */
  private static accessTokenCache: {
    token: string;
    expireTime: number;
  } | null = null;

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

  /**
   * 获取房间交易记录
   */
  @Post('/transactions')
  public async getRoomTransactions(
    @Body() data: { roomId: number; userId?: number }
  ): Promise<Resp> {
    try {
      if (!data.roomId) return Resp.errMsg('房间ID不能为空');

      let transactions;

      if (data.userId) {
        // 获取指定用户在房间内的交易记录
        transactions = await this.transactionService.getUserTransactionsInRoom(
          data.roomId,
          data.userId
        );
      } else {
        // 获取房间内所有交易记录
        transactions = await this.transactionService.getRoomTransactions(
          data.roomId
        );
      }

      return Resp.okData(transactions);
    } catch (error) {
      return Resp.errMsg(error.message || '获取交易记录失败');
    }
  }

  /**
   * 获取房间交易统计和记录
   */
  @Post('/transaction-stats')
  public async getRoomTransactionStats(
    @Body() data: { roomId: number }
  ): Promise<Resp> {
    try {
      if (!data.roomId) return Resp.errMsg('房间ID不能为空');

      // 获取房间用户统计信息
      const userStats = await this.transactionService.getRoomUserStats(
        data.roomId
      );

      // 获取房间所有交易记录（包含用户信息）
      const transactions =
        await this.transactionService.getRoomTransactionsWithUserInfo(
          data.roomId
        );

      // 计算总体统计
      const totalStats = {
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.payMoney, 0),
        totalUsers: userStats.length,
      };

      return Resp.okData({
        userStats, // 用户统计信息
        transactions, // 所有交易记录
        totalStats, // 总体统计
      });
    } catch (error) {
      return Resp.errMsg(error.message || '获取交易统计失败');
    }
  }

  /**
   * 查询对局记录（分页）
   */
  @Post('/game-records')
  public async getGameRecords(
    @Body()
    data: {
      userId?: number;
      page?: number;
      pageSize?: number;
      roomId?: number;
    }
  ): Promise<Resp> {
    try {
      const page = data.page || 1;
      const pageSize = data.pageSize || 10;

      if (pageSize > 50) {
        return Resp.errMsg('每页最多查询50条记录');
      }

      const gameRecords = await this.roomService.getGameRecords({
        userId: data.userId,
        roomId: data.roomId,
        page,
        pageSize,
      });

      return Resp.okData(gameRecords);
    } catch (error) {
      return Resp.errMsg(error.message || '查询对局记录失败');
    }
  }

  /**
   * 生成小程序二维码
   */
  @Post('/generate-qrcode')
  public async generateQrcode(
    @Body()
    data: {
      roomId: number;
      path?: string;
      width?: number;
    }
  ): Promise<Resp> {
    if (!data.roomId) return Resp.errMsg('房间ID不能为空');

    // 验证房间是否存在
    const room = await this.roomService.getRoomById(data.roomId);
    if (!room) return Resp.errMsg('房间不存在');

    // 设置默认参数
    const path = `${data.path}`;
    const width = data.width || 430;

    // 获取微信小程序access_token
    const accessToken = await this.getWechatAccessToken();
    if (!accessToken) {
      return Resp.errMsg('获取微信访问令牌失败');
    }

    // 调用微信API生成小程序码
    const qrcodeUrl = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;

    const response = await axios.post(
      qrcodeUrl,
      {
        scene: `roomId=${data.roomId}`,
        page: path,
        width: width,
        auto_color: false,
        line_color: { r: 0, g: 0, b: 0 },
        is_hyaline: false,
      },
      {
        responseType: 'arraybuffer',
        timeout: 10000,
      }
    );

    // 检查响应内容类型
    const contentType = response.headers['content-type'] || '';

    if (contentType.includes('image')) {
      // 成功返回图片数据
      const base64Image = Buffer.from(response.data).toString('base64');
      const imageDataUrl = `data:image/png;base64,${base64Image}`;

      return Resp.okData({
        qrcode: imageDataUrl,
        roomId: data.roomId,
        roomName: room.roomName,
        path: path,
        width: width,
      });
    } else {
      // 响应是错误信息（JSON格式）
      try {
        // 将arraybuffer转换为字符串，然后解析JSON
        const errorText = Buffer.from(response.data).toString('utf8');
        const errorInfo = JSON.parse(errorText);

        console.error('微信API错误:', errorInfo);

        // 根据错误码提供更友好的错误信息
        let errorMessage = '生成二维码失败';
        switch (errorInfo.errcode) {
          case 40001:
            errorMessage = 'access_token无效或已过期';
            break;
          case 41030:
            errorMessage = '页面路径不正确';
            break;
          case 45009:
            errorMessage = '接口调用超过限额';
            break;
          case 47001:
            errorMessage = '参数错误';
            break;
          default:
            errorMessage = errorInfo.errmsg || '未知错误';
        }

        return Resp.errMsg(
          `生成二维码失败: ${errorMessage} (错误码: ${errorInfo.errcode})`
        );
      } catch (parseError) {
        console.error('解析微信API错误响应失败:', parseError);
        console.error('原始响应数据:', response.data);
        return Resp.errMsg('生成二维码失败: 服务器响应格式错误');
      }
    }
  }

  /**
   * 获取微信小程序access_token
   */
  private async getWechatAccessToken(): Promise<string | null> {
    try {
      const cacheKey = 'wechat_access_token';
      const cacheValue = await this.redisCache.get('', cacheKey);

      // 检查缓存是否有效
      if (cacheValue) {
        return cacheValue;
      }

      let miniDict = await this.sysDictDataRepository.selectByPage({
        dictType: 'mini_appid_secret',
      });
      let miniConfig = JSON.parse(miniDict[0][0].dataValue);

      const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${miniConfig.appid}&secret=${miniConfig.secret}`;

      const response = await axios.get(tokenUrl, { timeout: 5000 });

      if (response.data.access_token) {
        await this.redisCache.set(
          '',
          cacheKey,
          response.data.access_token,
          2 * 60 * 60
        ); // 缓存2小时
        return response.data.access_token;
      } else {
        console.error('获取access_token失败:', response.data);
        return null;
      }
    } catch (error) {
      console.error('获取微信access_token错误:', error);
      return null;
    }
  }

  /**
   * 清除access_token缓存（用于调试或强制刷新）
   */
  @Post('/clear-token-cache')
  public async clearTokenCache(): Promise<Resp> {
    RoomController.accessTokenCache = null;
    console.log('access_token缓存已清除');
    return Resp.okMsg('缓存已清除');
  }

  /**
   * 获取access_token缓存状态（用于调试）
   */
  @Post('/token-cache-status')
  public async getTokenCacheStatus(): Promise<Resp> {
    if (!RoomController.accessTokenCache) {
      return Resp.okData({
        cached: false,
        message: '无缓存',
      });
    }

    const now = Date.now();
    const isValid = RoomController.accessTokenCache.expireTime > now;
    const remainingTime = Math.max(
      0,
      RoomController.accessTokenCache.expireTime - now
    );

    return Resp.okData({
      cached: true,
      valid: isValid,
      expireTime: new Date(
        RoomController.accessTokenCache.expireTime
      ).toLocaleString(),
      remainingSeconds: Math.floor(remainingTime / 1000),
      token: RoomController.accessTokenCache.token.substring(0, 10) + '...', // 只显示前10位
    });
  }
}
