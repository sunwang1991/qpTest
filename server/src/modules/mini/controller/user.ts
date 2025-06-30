import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { Resp } from '../../../framework/resp/api';
import {
  RateLimitMiddleware,
  LIMIT_IP,
} from '../../../framework/middleware/rate_limit';
import { UserService } from '../service/user';
import { TransactionService } from '../service/transaction';
import { UserModel } from '../model/user';

/**
 * 用户信息
 *
 */
@Controller('/mini/user')
export class UserController {
  /**用户服务 */
  @Inject()
  private userService: UserService;

  /**交易服务 */
  @Inject()
  private transactionService: TransactionService;

  /**用户注册 */
  @Post('/register', {
    middleware: [RateLimitMiddleware({ time: 300, count: 10, type: LIMIT_IP })],
  })
  public async register(@Body() user: UserModel): Promise<Resp> {
    if (!user.openId) return Resp.errMsg('code不能为空');
    const userInfo = await this.userService.register(user);
    return Resp.okData(userInfo);
  }

  /**用户登录 */
  @Post('/login')
  public async login(@Body() data: { code: string }): Promise<Resp> {
    try {
      if (!data.code) return Resp.errMsg('code不能为空');

      // 用户登录获取基本信息
      const userInfo = await this.userService.login(data.code);

      if (!userInfo || !userInfo.id) {
        return Resp.errMsg('登录失败');
      }

      // 获取用户战绩统计
      const gameStats = await this.transactionService.getUserGameStats(
        userInfo.id
      );

      // 合并用户信息和战绩统计
      const userInfoWithStats = {
        ...userInfo,
        gameStats: {
          totalIncome: gameStats.totalIncome, // 总收入
          winRate: gameStats.winRate, // 胜率
          totalGames: gameStats.totalGames, // 总局数
          winGames: gameStats.winGames, // 胜利场次
          loseGames: gameStats.loseGames, // 失败场次
          netIncome: gameStats.netIncome, // 净收入
          totalExpense: gameStats.totalExpense, // 总支出
        },
      };

      return Resp.okData(userInfoWithStats);
    } catch (error) {
      console.error('用户登录失败:', error);
      return Resp.errMsg(error.message || '登录失败');
    }
  }

  /**用户信息 */
  @Post('/info')
  public async info(@Body() data: { id: string }): Promise<Resp> {
    try {
      if (!data.id) return Resp.errMsg('id不能为空');

      // 获取用户基本信息
      const userInfo = await this.userService.getUserInfo(data.id);

      if (!userInfo) {
        return Resp.errMsg('用户不存在');
      }

      // 获取用户战绩统计
      const gameStats = await this.transactionService.getUserGameStats(
        parseInt(data.id)
      );

      // 合并用户信息和战绩统计
      const userInfoWithStats = {
        ...userInfo,
        gameStats: {
          totalIncome: gameStats.totalIncome, // 总收入
          winRate: gameStats.winRate, // 胜率
          totalGames: gameStats.totalGames, // 总局数
          winGames: gameStats.winGames, // 胜利场次
          loseGames: gameStats.loseGames, // 失败场次
          netIncome: gameStats.netIncome, // 净收入
          totalExpense: gameStats.totalExpense, // 总支出
        },
      };

      return Resp.okData(userInfoWithStats);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return Resp.errMsg(error.message || '获取用户信息失败');
    }
  }

  /**
   * 更新用户信息
   * @param data
   */
  @Post('/update')
  public async update(
    @Body() data: { id: string; avatar: string; nickName: string }
  ): Promise<Resp> {
    if (!data.id) return Resp.errMsg('id不能为空');
    await this.userService.updateUserInfo(data);
    return Resp.okData(null);
  }
}
