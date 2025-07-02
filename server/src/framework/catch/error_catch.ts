import { Catch, HttpStatus } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

import { Resp } from '../resp/api';
import { loginUserToUserID } from '../reqctx/auth';

/**
 * 默认全局错误统一捕获
 *
 * 所有的未分类错误会到这里
 */
@Catch()
export class ErrorCatch {
  async catch(err: Error, c: Context) {
    const userId = loginUserToUserID(c);
    c.logger.error(
      '[Recovery][%d] panic recovered: %s => %s %s',
      userId,
      c.url,
      err.name,
      err.message
    );

    // 记录更多调试信息到日志
    c.logger.error('详细错误信息: %o', {
      stack: err.stack,
      headers: c.headers,
      query: c.query,
      body: c.request.body,
    });

    // 返回错误响应给客户端
    if (c.app.getEnv() === 'prod') {
      // 生产环境中使用通用错误消息
      // 但为特定错误类型提供更有用的信息
      let prodMsg = 'internal error';

      // 为特定错误提供更友好的消息
      if (err.name === 'CSRFError') {
        // 记录更详细的 CSRF 错误信息
        c.logger.error('CSRF Error 详情: %o', {
          referer: c.header.referer,
          origin: c.header.origin,
          host: c.header.host,
          url: c.url,
        });
        prodMsg = '请求来源无效，请刷新页面重试';
      } else if (err.name === 'PayloadTooLargeError') {
        prodMsg = '上传文件过大';
      } else if (err.name === 'ValidationError') {
        prodMsg = '输入数据格式有误';
      }

      c.body = Resp.codeMsg(500001, prodMsg);
      c.status = HttpStatus.INTERNAL_SERVER_ERROR;
      return;
    }

    let msg = err.message;
    // 过滤已经知道的错误
    const errMsgs = [
      { k: 'QueryFailedError', v: '访问数据权限错误' },
      { k: 'CSRFError', v: `无效 Referer ${c.header.referer || '未知'}` },
      { k: 'PayloadTooLargeError', v: '超出最大上传文件大小范围' },
      { k: 'MultipartInvalidFilenameError', v: '上传文件拓展格式不支持' },
    ];
    const msgItem = errMsgs.find(n => n.k === err.name);
    if (msgItem) {
      msg = msgItem.v;
    }

    // 返回500，提示错误信息
    c.body = Resp.codeMsg(500001, msg);
    c.status = HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
