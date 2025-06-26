import { SysPost } from '../model/sys_post';
/**岗位表 数据层处理 */
export declare class SysPostRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[SysPost[], number]>;
    /**
     * 查询集合
     *
     * @param sysPost 信息
     * @return 列表
     */
    select(sysPost: SysPost): Promise<SysPost[]>;
    /**
     * 通过ID查询
     *
     * @param postIds ID数组
     * @return 信息
     */
    selectByIds(postIds: number[]): Promise<SysPost[]>;
    /**
     * 新增
     *
     * @param sysPost 信息
     * @return ID
     */
    insert(sysPost: SysPost): Promise<number>;
    /**
     * 更新
     *
     * @param sysPost 信息
     * @return 影响记录数
     */
    update(sysPost: SysPost): Promise<number>;
    /**
     * 批量删除
     *
     * @param postIds ID数组
     * @return 影响记录数
     */
    deleteByIds(postIds: number[]): Promise<number>;
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysPost 信息
     * @returns
     */
    checkUnique(sysPost: SysPost): Promise<number>;
    /**
     * 根据用户ID获取岗位选择框列表
     * @param configKey 数据Key
     * @returns
     */
    selectByUserId(userId: number): Promise<SysPost[]>;
}
