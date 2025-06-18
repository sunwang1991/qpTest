import { IProcessor } from '@midwayjs/bull';
/**Foo 队列任务处理  */
export declare class FooProcessor implements IProcessor {
    /**上下文 */
    private c;
    execute(options: ProcessorOptions): Promise<ProcessorData>;
}
