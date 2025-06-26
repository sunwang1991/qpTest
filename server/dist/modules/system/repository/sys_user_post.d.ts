import { SysUserPost } from '../model/sys_user_post';
/**用户与岗位关联表 数据层处理 */
export declare class SysUserPostRepository {
    private db;
    /**
     * 存在用户使用数量
     * @param postId 岗位ID
     * @returns 数量
     */
    existUserByPostId(postId: number): Promise<number>;
    /**
     * 批量删除关联By用户
     *
     * @param userIds ID数组
     * @return 影响记录数
     */
    deleteByUserIds(userIds: number[]): Promise<number>;
    /**
     * 批量新增信息
     *
     * @param userRoles 信息
     * @return 影响记录数
     */
    batchInsert(sysUserPosts: SysUserPost[]): Promise<number>;
}
