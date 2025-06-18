import { IProcessor } from '@midwayjs/bull';
/**Bar 队列任务处理 */
export declare class BarProcessor implements IProcessor {
    /**上下文 */
    private c;
    execute(options: ProcessorOptions): Promise<ProcessorData>;
}
