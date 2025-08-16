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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const node_path_1 = require("node:path");
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const upload_sub_path_1 = require("../../../framework/constants/upload_sub_path");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const file_1 = require("../../../framework/utils/file/file");
const api_1 = require("../../../framework/resp/api");
/**文件操作 控制层处理*/
let FileController = exports.FileController = class FileController {
    /**上下文 */
    c;
    /**文件服务 */
    fileUtil;
    /**下载文件 */
    async download(filePath) {
        if (filePath.length < 8) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: filePath not is base64 string');
        }
        // base64解析出地址
        const routerPath = Buffer.from(filePath, 'base64').toString('utf-8');
        // 断点续传
        const headerRange = this.c.headers.range;
        const [resultMap, errMsg] = await this.fileUtil.readUploadFileStream(routerPath, headerRange);
        if (errMsg) {
            return api_1.Resp.errMsg(errMsg);
        }
        // 设置资源文件名称
        this.c.set('Accept-Ranges', 'bytes');
        this.c.set('Content-Type', 'application/octet-stream');
        this.c.set('Content-disposition', `attachment;filename=${encodeURIComponent((0, node_path_1.basename)(routerPath))}`);
        if (headerRange) {
            this.c.set('Content-Range', resultMap.range);
            this.c.set('Content-Length', `${resultMap.chunkSize}`);
            this.c.status = 206;
        }
        else {
            this.c.set('Content-Length', `${resultMap.fileSize}`);
            this.c.status = 200;
        }
        this.c.body = resultMap.data;
    }
    /**上传文件 */
    // @Post('/upload', {
    //   middleware: [AuthorizeUserMiddleware()],
    // })
    async upload(files, subPath) {
        // 如果上传的文件数量不为1，则返回错误信息
        if (files.length !== 1) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: field file not upload');
        }
        const formFile = files[0];
        // 子路径需要在指定范围内
        const ok = upload_sub_path_1.UPLOAD_SUB_PATH[subPath];
        // 如果子路径不为空且不在指定范围内，则返回错误信息
        if (subPath && !ok) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: subPath not in range');
        }
        // 如果子路径为空，则设置为默认值
        if (!subPath) {
            subPath = upload_sub_path_1.UPLOAD_COMMON;
        }
        // 转移上传的文件
        const [uploadFilePath, err] = await this.fileUtil.transferUploadFile(formFile, subPath, []);
        // 如果转移文件出错，则返回错误信息
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        // 清理请求中的文件
        await this.c.cleanupRequestFiles();
        // 返回上传成功的信息
        return api_1.Resp.okData({
            url: `//${this.c.host}${uploadFilePath}`,
            filePath: uploadFilePath,
            newFileName: (0, node_path_1.basename)(uploadFilePath),
            originalFileName: formFile.filename,
        });
    }
    /**切片文件检查 */
    async chunkCheck(identifier, fileName) {
        // 读取标识目录
        const [chunks, err] = await this.fileUtil.chunkCheckFile(identifier, fileName);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okData(chunks);
    }
    /**切片文件合并 */
    async chunkMerge(identifier, fileName, subPath) {
        // 子路径需要在指定范围内
        const ok = upload_sub_path_1.UPLOAD_SUB_PATH[subPath];
        if (subPath && !ok) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: subPath not in range');
        }
        if (!subPath) {
            subPath = upload_sub_path_1.UPLOAD_COMMON;
        }
        // 切片文件合并
        const [mergeFilePath, err] = await this.fileUtil.chunkMergeFile(identifier, fileName, subPath);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okData({
            url: `//${this.c.host}${mergeFilePath}`,
            filePath: mergeFilePath,
            newFileName: (0, node_path_1.basename)(mergeFilePath),
            originalFileName: fileName,
        });
    }
    /**切片文件上传 */
    async chunkUpload(files, index, identifier) {
        if (index === '' || identifier === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: index and identifier must be set');
        }
        // 上传的文件
        if (files.length !== 1) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: field file not upload');
        }
        const formFile = files[0];
        const [chunkFilePath, err] = await this.fileUtil.transferChunkUploadFile(formFile, index, identifier);
        if (err) {
            this.c.status = 200;
            return api_1.Resp.errMsg(err);
        }
        await this.c.cleanupRequestFiles();
        this.c.status = 206;
        return api_1.Resp.okData(chunkFilePath);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], FileController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], FileController.prototype, "fileUtil", void 0);
__decorate([
    (0, core_1.Get)('/download/:filePath', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Param)('filePath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "download", null);
__decorate([
    (0, core_1.Post)('/upload')
    // 上传文件
    ,
    __param(0, (0, core_1.Files)('file')),
    __param(1, (0, core_1.Fields)('subPath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "upload", null);
__decorate([
    (0, core_1.Post)('/chunk-check', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Body)('identifier')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Body)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "chunkCheck", null);
__decorate([
    (0, core_1.Post)('/chunk-merge', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Body)('identifier')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Body)('fileName')),
    __param(2, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(2, (0, core_1.Body)('subPath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "chunkMerge", null);
__decorate([
    (0, core_1.Post)('/chunk-upload', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
    __param(0, (0, core_1.Files)('file')),
    __param(1, (0, core_1.Fields)('index')),
    __param(2, (0, core_1.Fields)('identifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "chunkUpload", null);
exports.FileController = FileController = __decorate([
    (0, core_1.Controller)('/file')
], FileController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbW1vbi9jb250cm9sbGVyL2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQXFDO0FBRXJDLHlDQVN3QjtBQUV4QixpREFBcUQ7QUFHckQsa0ZBR3NEO0FBQ3RELGlGQUF1RjtBQUN2Riw2REFBOEQ7QUFDOUQscURBQW1EO0FBRW5ELGVBQWU7QUFFUixJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUN6QixTQUFTO0lBRUQsQ0FBQyxDQUFVO0lBRW5CLFVBQVU7SUFFRixRQUFRLENBQVc7SUFFM0IsVUFBVTtJQUlHLEFBQU4sS0FBSyxDQUFDLFFBQVEsQ0FDcUMsUUFBZ0I7UUFFeEUsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO1NBQ3hFO1FBQ0QsY0FBYztRQUNkLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyRSxPQUFPO1FBQ1AsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUNsRSxVQUFVLEVBQ1YsV0FBVyxDQUNaLENBQUM7UUFDRixJQUFJLE1BQU0sRUFBRTtZQUNWLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtRQUVELFdBQVc7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQ1IscUJBQXFCLEVBQ3JCLHVCQUF1QixrQkFBa0IsQ0FBQyxJQUFBLG9CQUFRLEVBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUNsRSxDQUFDO1FBRUYsSUFBSSxXQUFXLEVBQUU7WUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztTQUNyQjtRQUVELElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFDL0IsQ0FBQztJQUVELFVBQVU7SUFDVixxQkFBcUI7SUFDckIsNkNBQTZDO0lBQzdDLEtBQUs7SUFHUSxBQUFOLEtBQUssQ0FBQyxNQUFNLENBRUYsS0FBK0IsRUFFM0IsT0FBZTtRQUVsQyx1QkFBdUI7UUFDdkIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN0QixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ2hFO1FBQ0QsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFCLGNBQWM7UUFDZCxNQUFNLEVBQUUsR0FBRyxpQ0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLDJCQUEyQjtRQUMzQixJQUFJLE9BQU8sSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQy9EO1FBQ0Qsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsK0JBQWEsQ0FBQztTQUN6QjtRQUVELFVBQVU7UUFDVixNQUFNLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FDbEUsUUFBUSxFQUNSLE9BQU8sRUFDUCxFQUFFLENBQ0gsQ0FBQztRQUNGLG1CQUFtQjtRQUNuQixJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtRQUVELFdBQVc7UUFDWCxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNuQyxZQUFZO1FBQ1osT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2pCLEdBQUcsRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLGNBQWMsRUFBRTtZQUN4QyxRQUFRLEVBQUUsY0FBYztZQUN4QixXQUFXLEVBQUUsSUFBQSxvQkFBUSxFQUFDLGNBQWMsQ0FBQztZQUNyQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsUUFBUTtTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsWUFBWTtJQUlDLEFBQU4sS0FBSyxDQUFDLFVBQVUsQ0FFb0MsVUFBa0IsRUFFcEIsUUFBZ0I7UUFFdkUsU0FBUztRQUNULE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FDdEQsVUFBVSxFQUNWLFFBQVEsQ0FDVCxDQUFDO1FBQ0YsSUFBSSxHQUFHLEVBQUU7WUFDUCxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7UUFDRCxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELFlBQVk7SUFJQyxBQUFOLEtBQUssQ0FBQyxVQUFVLENBRW9DLFVBQWtCLEVBRXBCLFFBQWdCLEVBRWxCLE9BQWU7UUFFcEUsY0FBYztRQUNkLE1BQU0sRUFBRSxHQUFHLGlDQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsSUFBSSxPQUFPLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLE9BQU8sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztTQUMvRDtRQUNELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsK0JBQWEsQ0FBQztTQUN6QjtRQUVELFNBQVM7UUFDVCxNQUFNLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQzdELFVBQVUsRUFDVixRQUFRLEVBQ1IsT0FBTyxDQUNSLENBQUM7UUFDRixJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtRQUVELE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNqQixHQUFHLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxhQUFhLEVBQUU7WUFDdkMsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLElBQUEsb0JBQVEsRUFBQyxhQUFhLENBQUM7WUFDcEMsZ0JBQWdCLEVBQUUsUUFBUTtTQUMzQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsWUFBWTtJQUlDLEFBQU4sS0FBSyxDQUFDLFdBQVcsQ0FFUCxLQUErQixFQUU3QixLQUFhLEVBRVIsVUFBa0I7UUFFeEMsSUFBSSxLQUFLLEtBQUssRUFBRSxJQUFJLFVBQVUsS0FBSyxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLE9BQU8sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsNENBQTRDLENBQUMsQ0FBQztTQUMzRTtRQUNELFFBQVE7UUFDUixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGlDQUFpQyxDQUFDLENBQUM7U0FDaEU7UUFDRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUIsTUFBTSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQ3RFLFFBQVEsRUFDUixLQUFLLEVBQ0wsVUFBVSxDQUNYLENBQUM7UUFDRixJQUFJLEdBQUcsRUFBRTtZQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7UUFDRCxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDcEIsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDRixDQUFBO0FBeE1TO0lBRFAsSUFBQSxhQUFNLEVBQUMsS0FBSyxDQUFDOzt5Q0FDSztBQUlYO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ1MsZUFBUTtnREFBQztBQU1kO0lBSFosSUFBQSxVQUFHLEVBQUMscUJBQXFCLEVBQUU7UUFDMUIsVUFBVSxFQUFFLENBQUMsSUFBQSx3Q0FBdUIsR0FBRSxDQUFDO0tBQ3hDLENBQUM7SUFFQyxXQUFBLElBQUEsZ0JBQUssRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFBRSxXQUFBLElBQUEsWUFBSyxFQUFDLFVBQVUsQ0FBQyxDQUFBOzs7OzhDQXFDeEQ7QUFRWTtJQUZaLElBQUEsV0FBSSxFQUFDLFNBQVMsQ0FBQztJQUNoQixPQUFPOztJQUdKLFdBQUEsSUFBQSxZQUFLLEVBQUMsTUFBTSxDQUFDLENBQUE7SUFFYixXQUFBLElBQUEsYUFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFBOzs7OzRDQXlDbkI7QUFNWTtJQUhaLElBQUEsV0FBSSxFQUFDLGNBQWMsRUFBRTtRQUNwQixVQUFVLEVBQUUsQ0FBQyxJQUFBLHdDQUF1QixHQUFFLENBQUM7S0FDeEMsQ0FBQztJQUdDLFdBQUEsSUFBQSxnQkFBSyxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUFFLFdBQUEsSUFBQSxXQUFJLEVBQUMsWUFBWSxDQUFDLENBQUE7SUFFdkQsV0FBQSxJQUFBLGdCQUFLLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQUUsV0FBQSxJQUFBLFdBQUksRUFBQyxVQUFVLENBQUMsQ0FBQTs7OztnREFXdkQ7QUFNWTtJQUhaLElBQUEsV0FBSSxFQUFDLGNBQWMsRUFBRTtRQUNwQixVQUFVLEVBQUUsQ0FBQyxJQUFBLHdDQUF1QixHQUFFLENBQUM7S0FDeEMsQ0FBQztJQUdDLFdBQUEsSUFBQSxnQkFBSyxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUFFLFdBQUEsSUFBQSxXQUFJLEVBQUMsWUFBWSxDQUFDLENBQUE7SUFFdkQsV0FBQSxJQUFBLGdCQUFLLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQUUsV0FBQSxJQUFBLFdBQUksRUFBQyxVQUFVLENBQUMsQ0FBQTtJQUVyRCxXQUFBLElBQUEsZ0JBQUssRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQUUsV0FBQSxJQUFBLFdBQUksRUFBQyxTQUFTLENBQUMsQ0FBQTs7OztnREE0QnJEO0FBTVk7SUFIWixJQUFBLFdBQUksRUFBQyxlQUFlLEVBQUU7UUFDckIsVUFBVSxFQUFFLENBQUMsSUFBQSx3Q0FBdUIsR0FBRSxDQUFDO0tBQ3hDLENBQUM7SUFHQyxXQUFBLElBQUEsWUFBSyxFQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRWIsV0FBQSxJQUFBLGFBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQTtJQUVmLFdBQUEsSUFBQSxhQUFNLEVBQUMsWUFBWSxDQUFDLENBQUE7Ozs7aURBeUJ0Qjt5QkExTVUsY0FBYztJQUQxQixJQUFBLGlCQUFVLEVBQUMsT0FBTyxDQUFDO0dBQ1AsY0FBYyxDQTJNMUIifQ==