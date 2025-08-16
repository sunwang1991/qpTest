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
    //设定随机图片
    let avatarList = [
      'https://www.sunwang.top/upload/avatar/2025/08/3WE0ZnFe1SQ46d62ad7388264705f044975f1f83ade1_e2qund.jpg',
      'https://www.sunwang.top/upload/avatar/2025/08/1MsWuju8dc2v4795f58d334ef25d3c583f3ffd7fa253_kwzpl1.jpg',
      'https://www.sunwang.top/upload/avatar/2025/08/3r0rq07bN4Rs7099b29b5e667467dc06e6ad186c4264_htvkkm.jpeg',
      'https://www.sunwang.top/upload/avatar/2025/08/AtJ2LJRuwn618084a90ef3dcdb62b00b3d7df8957d52_lpxv6s.jpg',
      'https://www.sunwang.top/upload/avatar/2025/08/UU5wNwK4xpE8f558ca3365ee63d8051ba0036e01dc11_cea4po.jpg',
      'https://www.sunwang.top/upload/avatar/2025/08/CV0xBQsivG6317eca60357136c10ddd4f05f1bf31b97_b1dwy6.jpg',
      'https://www.sunwang.top/upload/avatar/2025/08/DWRZDlkpFRVf57f535346bbb285b2184f45bb8f050f1_s8u38r.jpg',
      'https://www.sunwang.top/upload/avatar/2025/08/jLCicKUnRkTqcd3b0ab986e74146f2ea8074de731824_3ewp8w.jpg',
      'https://www.sunwang.top/upload/avatar/2025/08/QFQflGwgka7P230db2d969061357a0384d64a20a5535_rbd1b4.jpg',
    ];
    // 插入数据
    userInfo = {
      ...userInfo,
      nickName: '匿名用户',
      avatar: avatarList[Math.floor(Math.random() * avatarList.length)],
    };
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
