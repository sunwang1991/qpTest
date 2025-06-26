import { Inject, Provide, Singleton } from '@midwayjs/core';
import { DynamicDataSource } from '../../../framework/datasource/db/db';
import { UserModel } from '../model/user';

/**用户表 数据层处理 */
@Provide()
@Singleton()
export class UserRepository {
  @Inject()
  private db: DynamicDataSource;
  /**
   * 通过openId查询
   *
   * @param openId
   * @return 信息
   */
  public async selectByOpenId(openId: string): Promise<UserModel> {
    if (openId === '') {
      return null;
    }
    // 查询数据
    const userInfo = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('user')
      .from(UserModel, 'user')
      .where('user.openId = :openId', { openId: openId })
      .getOne();
    if (userInfo) return userInfo;
    return null;
  }

  /**
   * 插入数据
   *
   * @param userInfo
   * @return 信息
   */
  public async insertUserInfo(userInfo): Promise<UserModel> {
    // 插入数据
    const result = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .insert()
      .into(UserModel)
      .values(userInfo)
      .execute();
    return result.raw;
  }

  /**
   * 通过userId查询用户信息
   * @param id
   */
  async selectById(userId: string) {
    if (userId === '') return null;
    // 查询数据
    const userInfo = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .select('user')
      .from(UserModel, 'user')
      .where('user.id = :userId', { userId: userId })
      .getOne();
    if (userInfo) return userInfo;
    return null;
  }

  /**
   * 更新用户信息
   * @param userInfo
   */
  async updateUserInfo(userInfo) {
    const result = await this.db
      .queryBuilder('')
      .createQueryBuilder()
      .update(UserModel)
      .set(userInfo)
      .where('id = :id', { id: userInfo.id })
      .execute();
    return result.raw;
  }
}
