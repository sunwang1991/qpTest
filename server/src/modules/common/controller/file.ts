import { basename } from 'node:path';

import {
  Body,
  Controller,
  Fields,
  Files,
  Get,
  Inject,
  Param,
  Post,
} from '@midwayjs/core';
import { UploadFileInfo } from '@midwayjs/upload';
import { RuleType, Valid } from '@midwayjs/validate';
import { Context } from '@midwayjs/koa';

import {
  UPLOAD_COMMON,
  UPLOAD_SUB_PATH,
} from '../../../framework/constants/upload_sub_path';
import { AuthorizeUserMiddleware } from '../../../framework/middleware/authorize_user';
import { FileUtil } from '../../../framework/utils/file/file';
import { Resp } from '../../../framework/resp/api';

/**文件操作 控制层处理*/
@Controller('/file')
export class FileController {
  /**上下文 */
  @Inject('ctx')
  private c: Context;

  /**文件服务 */
  @Inject()
  private fileUtil: FileUtil;

  /**下载文件 */
  @Get('/download/:filePath', {
    middleware: [AuthorizeUserMiddleware()],
  })
  public async download(
    @Valid(RuleType.string().required()) @Param('filePath') filePath: string
  ) {
    if (filePath.length < 8) {
      this.c.status = 422;
      return Resp.codeMsg(422002, 'bind err: filePath not is base64 string');
    }
    // base64解析出地址
    const routerPath = Buffer.from(filePath, 'base64').toString('utf-8');

    // 断点续传
    const headerRange = this.c.headers.range;
    const [resultMap, errMsg] = await this.fileUtil.readUploadFileStream(
      routerPath,
      headerRange
    );
    if (errMsg) {
      return Resp.errMsg(errMsg);
    }

    // 设置资源文件名称
    this.c.set('Accept-Ranges', 'bytes');
    this.c.set('Content-Type', 'application/octet-stream');
    this.c.set(
      'Content-disposition',
      `attachment;filename=${encodeURIComponent(basename(routerPath))}`
    );

    if (headerRange) {
      this.c.set('Content-Range', resultMap.range);
      this.c.set('Content-Length', `${resultMap.chunkSize}`);
      this.c.status = 206;
    } else {
      this.c.set('Content-Length', `${resultMap.fileSize}`);
      this.c.status = 200;
    }

    this.c.body = resultMap.data;
  }

  /**上传文件 */
  // @Post('/upload', {
  //   middleware: [AuthorizeUserMiddleware()],
  // })
  @Post('/upload')
  // 上传文件
  public async upload(
    // 获取上传的文件
    @Files('file') files: UploadFileInfo<string>[],
    // 获取子路径
    @Fields('subPath') subPath: string
  ) {
    // 如果上传的文件数量不为1，则返回错误信息
    if (files.length !== 1) {
      this.c.status = 422;
      return Resp.codeMsg(422002, 'bind err: field file not upload');
    }
    const formFile = files[0];

    // 子路径需要在指定范围内
    const ok = UPLOAD_SUB_PATH[subPath];
    // 如果子路径不为空且不在指定范围内，则返回错误信息
    if (subPath && !ok) {
      this.c.status = 422;
      return Resp.codeMsg(422002, 'bind err: subPath not in range');
    }
    // 如果子路径为空，则设置为默认值
    if (!subPath) {
      subPath = UPLOAD_COMMON;
    }

    // 转移上传的文件
    const [uploadFilePath, err] = await this.fileUtil.transferUploadFile(
      formFile,
      subPath,
      []
    );
    // 如果转移文件出错，则返回错误信息
    if (err) {
      return Resp.errMsg(err);
    }

    // 清理请求中的文件
    await this.c.cleanupRequestFiles();
    // 返回上传成功的信息
    return Resp.okData({
      url: `//${this.c.host}${uploadFilePath}`,
      filePath: uploadFilePath,
      newFileName: basename(uploadFilePath),
      originalFileName: formFile.filename,
    });
  }

  /**切片文件检查 */
  @Post('/chunk-check', {
    middleware: [AuthorizeUserMiddleware()],
  })
  public async chunkCheck(
    /**唯一标识 */
    @Valid(RuleType.string().required()) @Body('identifier') identifier: string,
    /**文件名 */
    @Valid(RuleType.string().required()) @Body('fileName') fileName: string
  ) {
    // 读取标识目录
    const [chunks, err] = await this.fileUtil.chunkCheckFile(
      identifier,
      fileName
    );
    if (err) {
      return Resp.errMsg(err);
    }
    return Resp.okData(chunks);
  }

  /**切片文件合并 */
  @Post('/chunk-merge', {
    middleware: [AuthorizeUserMiddleware()],
  })
  public async chunkMerge(
    /**唯一标识 */
    @Valid(RuleType.string().required()) @Body('identifier') identifier: string,
    /**文件名 */
    @Valid(RuleType.string().required()) @Body('fileName') fileName: string,
    /**子路径类型 */
    @Valid(RuleType.string().allow('')) @Body('subPath') subPath: string
  ) {
    // 子路径需要在指定范围内
    const ok = UPLOAD_SUB_PATH[subPath];
    if (subPath && !ok) {
      this.c.status = 422;
      return Resp.codeMsg(422002, 'bind err: subPath not in range');
    }
    if (!subPath) {
      subPath = UPLOAD_COMMON;
    }

    // 切片文件合并
    const [mergeFilePath, err] = await this.fileUtil.chunkMergeFile(
      identifier,
      fileName,
      subPath
    );
    if (err) {
      return Resp.errMsg(err);
    }

    return Resp.okData({
      url: `//${this.c.host}${mergeFilePath}`,
      filePath: mergeFilePath,
      newFileName: basename(mergeFilePath),
      originalFileName: fileName,
    });
  }

  /**切片文件上传 */
  @Post('/chunk-upload', {
    middleware: [AuthorizeUserMiddleware()],
  })
  public async chunkUpload(
    /**上传的文件 */
    @Files('file') files: UploadFileInfo<string>[],
    /**切片编号 */
    @Fields('index') index: string,
    /**切片唯一标识 */
    @Fields('identifier') identifier: string
  ) {
    if (index === '' || identifier === '') {
      this.c.status = 422;
      return Resp.codeMsg(422002, 'bind err: index and identifier must be set');
    }
    // 上传的文件
    if (files.length !== 1) {
      this.c.status = 422;
      return Resp.codeMsg(422002, 'bind err: field file not upload');
    }
    const formFile = files[0];

    const [chunkFilePath, err] = await this.fileUtil.transferChunkUploadFile(
      formFile,
      index,
      identifier
    );
    if (err) {
      this.c.status = 200;
      return Resp.errMsg(err);
    }
    await this.c.cleanupRequestFiles();
    this.c.status = 206;
    return Resp.okData(chunkFilePath);
  }
}
