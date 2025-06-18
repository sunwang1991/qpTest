"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooProcessor = void 0;
const bull_1 = require("@midwayjs/bull");
const core_1 = require("@midwayjs/core");
/**Foo 队列任务处理  */
let FooProcessor = exports.FooProcessor = class FooProcessor {
    /**上下文 */
    c;
    async execute(options) {
        const log = this.c.getLogger();
        const ctxJob = this.c.job;
        // 执行一次得到是直接得到传入的jobId
        // 重复任务得到编码格式的jobId => repeat:编码Jobid:执行时间戳
        // options 获取任务执行时外部给到的参数数据
        // log 日志输出到bull配置的文件内
        // ctxJob 当前任务的上下文，可控制暂停进度等数据
        const { repeat, sysJob } = options;
        let i = 0;
        while (i < 20) {
            // 获取任务进度
            const progress = await ctxJob.progress();
            log.info('jonId: %d => 任务进度：%d', sysJob.jobId, progress);
            // 延迟响应
            await new Promise(resolve => setTimeout(() => resolve(i++), 2000));
            // 改变任务进度
            await ctxJob.progress(i);
        }
        // 返回结果，用于记录执行结果
        return {
            repeat: repeat,
            jobName: sysJob.jobName,
            invokeTarget: sysJob.invokeTarget,
            targetParams: sysJob.targetParams,
        };
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], FooProcessor.prototype, "c", void 0);
exports.FooProcessor = FooProcessor = __decorate([
    (0, bull_1.Processor)('foo')
], FooProcessor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbW9uaXRvci9wcm9jZXNzb3IvZm9vLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFnRTtBQUNoRSx5Q0FBd0M7QUFFeEMsaUJBQWlCO0FBRVYsSUFBTSxZQUFZLDBCQUFsQixNQUFNLFlBQVk7SUFDdkIsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQXlCO1FBQ3JDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFMUIsc0JBQXNCO1FBQ3RCLDJDQUEyQztRQUMzQywyQkFBMkI7UUFDM0Isc0JBQXNCO1FBQ3RCLDZCQUE2QjtRQUU3QixNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUVuQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDYixTQUFTO1lBQ1QsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pELE9BQU87WUFDUCxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkUsU0FBUztZQUNULE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUVELGdCQUFnQjtRQUNoQixPQUFPO1lBQ0wsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDdkIsWUFBWSxFQUFFLE1BQU0sQ0FBQyxZQUFZO1lBQ2pDLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtTQUNsQyxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUE7QUFqQ1M7SUFEUCxJQUFBLGFBQU0sRUFBQyxLQUFLLENBQUM7O3VDQUNLO3VCQUhSLFlBQVk7SUFEeEIsSUFBQSxnQkFBUyxFQUFDLEtBQUssQ0FBQztHQUNKLFlBQVksQ0FvQ3hCIn0=