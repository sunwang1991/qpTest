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
    async upload(files, subPath) {
        if (files.length !== 1) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: field file not upload');
        }
        const formFile = files[0];
        // 子路径需要在指定范围内
        const ok = upload_sub_path_1.UPLOAD_SUB_PATH[subPath];
        if (subPath && !ok) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: subPath not in range');
        }
        if (!subPath) {
            subPath = upload_sub_path_1.UPLOAD_COMMON;
        }
        const [uploadFilePath, err] = await this.fileUtil.transferUploadFile(formFile, subPath, []);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        await this.c.cleanupRequestFiles();
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
    (0, core_1.Post)('/upload', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbW1vbi9jb250cm9sbGVyL2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQXFDO0FBRXJDLHlDQVN3QjtBQUV4QixpREFBcUQ7QUFHckQsa0ZBR3NEO0FBQ3RELGlGQUF1RjtBQUN2Riw2REFBOEQ7QUFDOUQscURBQW1EO0FBRW5ELGVBQWU7QUFFUixJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUN6QixTQUFTO0lBRUQsQ0FBQyxDQUFVO0lBRW5CLFVBQVU7SUFFRixRQUFRLENBQVc7SUFFM0IsVUFBVTtJQUlHLEFBQU4sS0FBSyxDQUFDLFFBQVEsQ0FDcUMsUUFBZ0I7UUFFeEUsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO1NBQ3hFO1FBQ0QsY0FBYztRQUNkLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyRSxPQUFPO1FBQ1AsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUNsRSxVQUFVLEVBQ1YsV0FBVyxDQUNaLENBQUM7UUFDRixJQUFJLE1BQU0sRUFBRTtZQUNWLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtRQUVELFdBQVc7UUFDWCxJQUFJLENB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