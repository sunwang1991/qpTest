import { DataSource, SelectQueryBuilder } from 'typeorm';
/**动态数据源 */
export declare class DynamicDataSource {
    private dataSourceManager;
    /**
     * 数据源
     * @param source 数据库连接
     * @return 连接实例
     */
    db(source: string): DataSource;
    /**
     * 获取可用数据源名称
     * @return 数据源名称
     */
    names(): string[];
    /**
     * 原生语句查询和执行
     *
     * 使用后自动释放连接
     *
     * @param source 数据源 空字符默认'default'
     * @param sql sql预编译语句
     * @param parameters 预编译?参数
     * @returns 查询结果或异常错误
     */
    execute<T>(source: string, sql: string, parameters?: any[]): Promise<any>;
    /**
     * 查询构造器
     *
     * 创建和控制单个数据库连接的状态, 允许控制事务但需要使用后手动释放连接
     *
     * @param source 数据源 空字符默认'default'
     * @returns 查询结果或异常错误
     */
    queryBuilder(source: string): SelectQueryBuilder<any>;
    /**
     * 分页页码记录数
     * @param pageNum 页码
     * @param pageSize 单页记录数
     * @returns [起始页码,单页记录数]
     */
    pageNumSize(pageNum: string | number, pageSize: string | number): [number, number];
}
