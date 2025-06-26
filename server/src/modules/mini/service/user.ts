import { Inject, Provide } from '@midwayjs/core';
import { UserModel } from '../model/user';
import { UserRepository } from '../repository/user';
import { HttpService } from '../../common/service/http.service';
/**
 * 用户信息 服务层处理
 */
@Provide()
export class UserService {
  @Inject()
  private userRepository: UserRepository;

  @Inject()
  private http: HttpService;

  /**
   * 账号注册
   * userInfo: 用户信息
   */
  async register(userInfo: UserModel): Promise<UserModel | null> {
    // 检查用户登录账号是否唯一
    const userMsg = await this.userRepository.selectByOpenId(userInfo.openId);
    if (userMsg) return null;
    const newUserInfo = await this.userRepository.insertUserInfo(userInfo);
    return newUserInfo;
  }

  /**
   * 检查用户是否注册
   */
  async checkIsRegister(openId: string): Promise<boolean> {
    return true;
  }

  /**
   * 登录
   * openId: 用户唯一标识
   *
   */
  async login(code: string): Promise<UserModel> {
    const openId = await this.getOpenId(code);
    // 检查用户登录账号是否唯一
    let userInfo = await this.userRepository.selectByOpenId(openId);
    if (!userInfo) {
      userInfo = await this.userRepository.insertUserInfo({ openId });
    }
    return userInfo;
  }

  /**
   * 通过code获取openId
   * @param code
   * @returns openId
   */
  async getOpenId(code: string): Promise<string> {
    // 发送请求，获取session
    const result = await this.http.get(
      'https://api.weixin.qq.com/sns/jscode2session',
      {
        js_code: code,
        appid: 'wxecb8522186879691',
        secret: '1eb1d2532fc2c1659a828f32b946a0b6',
        grant_type: 'authorization_code',
      }
    );
    // 检查返回数据结构，可能需要从 result.data 中获取
    const data = result.data || result;
    return data.openid;
  }

  /**
   * 获取用户信息
   * @param openId
   * @returns
   */
  async getUserInfo(userId: string): Promise<UserModel> {
    return await await this.userRepository.selectById(userId);
  }

  /**
   *
   * 更新用户信息
   * @param userId
   * @param userInfo
   * @returns
   */
  updateUserInfo(userInfo): Promise<UserModel> {
    return this.userRepository.updateUserInfo(userInfo);
  }
}
