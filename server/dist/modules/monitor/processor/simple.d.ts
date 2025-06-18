import { IProcessor } from '@midwayjs/bull';
/**简单示例 队列任务处理 */
export declare class SimpleProcessor implements IProcessor {
    /**上下文 */
    private c;
    execute(options: ProcessorOptions): Promise<ProcessorData>;
}
