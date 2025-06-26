import { Resp } from '../../../framework/resp/api';
import { DemoORM } from '../model/demo_orm';
/**
 * 演示-TypeORM基本使用
 *
 * 更多功能需要查阅 https://midwayjs.org/docs/extensions/orm
 */
export declare class DemoORMController {
    /**上下文 */
    private c;
    /**测试ORM信息服务 */
    private demoORMService;
    /**列表分页 */
    list(query: Record<string, string>): Promise<Resp>;
    /**列表无分页 */
    all(title: string, statusFlag: string): Promise<Resp>;
    /**信息 */
    info(id: number): Promise<Resp>;
    /**新增 */
    add(demoORM: DemoORM): Promise<Resp>;
    /**
     * 更新
     */
    update(demoORM: DemoORM): Promise<Resp>;
    /**删除 */
    remove(id: string): Promise<Resp>;
    /**清空 */
    clean(): Promise<Resp>;
}
