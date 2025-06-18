import { SysPost } from '../model/sys_post';
/**岗位表 服务层处理 */
export declare class SysPostService {
    /**岗位服务 */
    private sysPostRepository;
    /**用户与岗位关联服务 */
    private sysUserPostRepository;
    /**文件服务 */
    private fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns [rows, total]
     */
    findByPage(query: Record<string, string>): Promise<[SysPost[], number]>;
    /**
     * 查询数据
     * @param sysPost 信息
     * @returns []
     */
    find(sysPost: SysPost): Promise<SysPost[]>;
    /**
     * 根据ID查询信息
     * @param postId ID
     * @returns 结果
     */
    findById(postId: number): Promise<SysPost>;
    /**
     * 新增信息
     * @param sysPost 信息
     * @returns ID
     */
    insert(sysPost: SysPost): Promise<number>;
    /**
     * 修改信息
     * @param sysPost 信息
     * @returns 影响记录数
     */
    update(sysPost: SysPost): Promise<number>;
    /**
     * 批量删除信息
     * @param postIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    deleteByIds(postIds: number[]): Promise<[number, string]>;
    /**
     * 检查岗位名称是否唯一
     * @param postName 岗位名称
     * @param postId 岗位ID
     * @returns 数量
     */
    checkUniqueByName(postName: string, postId: number): Promise<boolean>;
    /**
     * 检查岗位编码是否唯一
     * @param postCode 岗位名称
     * @param postId 岗位ID
     * @returns 数量
     */
    checkUniqueByCode(postCode: string, postId: number): Promise<boolean>;
    /**
     * 根据用户ID获取岗位选择框列表
     * @param userId 用户ID
     * @returns 数量
     */
    findByUserId(userId: number): Promise<SysPost[]>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysPost[], fileName: string): Promise<import("exceljs").Buffer>;
}
