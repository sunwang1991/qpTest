import { DemoORM } from '../model/demo_orm';
/**
 * 测试ORM信息
 */
export declare class DemoORMService {
    private db;
    /**
     * 分页查询
     * @param query 参数
     * @returns
     */
    findByPage(query: Record<string, string>): Promise<[DemoORM[], number]>;
    /**
     * 查询集合
     *
     * @param param 信息
     * @return 列表
     */
    find(param: DemoORM): Promise<DemoORM[]>;
    /**
     * 通过ID查询
     *
     * @param id ID
     * @return 信息
     */
    findById(id: number): Promise<DemoORM>;
    /**
     * 新增
     *
     * @param param 信息
     * @return ID
     */
    insert(param: DemoORM): Promise<number>;
    /**
     * 更新
     *
     * @param param 信息
     * @return 影响记录数
     */
    update(param: DemoORM): Promise<number>;
    /**
     * 批量删除
     *
     * @param ids ID数组
     * @return 影响记录数
     */
    deleteByIds(ids: number[]): Promise<number>;
    /**
     * 清空测试ORM表
     * @return 删除记录数
     */
    clean(): Promise<number>;
}
