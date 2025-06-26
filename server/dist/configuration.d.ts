import { MidwayDecoratorService } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
export declare class MainConfiguration {
    app: koa.Application;
    decoratorService: MidwayDecoratorService;
    /**
     * 在依赖注入容器 ready 的时候执行
     */
    onReady(): Promise<void>;
    /**
     * 在应用服务启动后执行
     */
    onServerReady(): Promise<void>;
}
