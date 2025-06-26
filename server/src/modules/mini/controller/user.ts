import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { Resp } from '../../../framework/resp/api';
import {
  RateLimitMiddleware,
  LIMIT_IP,
} from '../../../framework/middleware/rate_limit';
import { UserService } from '../service/user';
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
    console.log(data);
    if (!data.code) return Resp.errMsg('code不能为空');
    const userInfo = await this.userService.login(data.code);
    return Resp.okData(userInfo);
  }

  /**用户信息 */
  @Post('/info')
  public async info(@Body() data: { id: string }): Promise<Resp> {
    if (!data.id) return Resp.errMsg('id不能为空');
    const userInfo = await this.userService.getUserInfo(data.id);
    return Resp.okData(userInfo);
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
