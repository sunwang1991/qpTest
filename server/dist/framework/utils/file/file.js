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
exports.FileUtil = void 0;
const node_path_1 = require("node:path");
const core_1 = require("@midwayjs/core");
const utils_1 = require("./utils");
const upload_sub_path_1 = require("../../constants/upload_sub_path");
const regular_1 = require("../regular/regular");
const data_1 = require("../date/data");
const execl_1 = require("./execl");
const generate_1 = require("../generate/generate");
const config_1 = require("../../config/config");
/**File文件工具验证处理*/
let FileUtil = exports.FileUtil = class FileUtil {
    /**配置信息 */
    config;
    /**
     * 生成文件名称
     * @param fileName 原始文件名称含后缀，如：logo.png
     * @returns fileName_随机值.extName
     */
    generateFileName(fileName) {
        const fileExt = (0, node_path_1.extname)(fileName);
        // 替换掉后缀和特殊字符保留文件名
        let newFileName = (0, regular_1.replace)(fileExt, fileName, '');
        newFileName = (0, regular_1.replace)('/[<>:"\\|?*]+/g', newFileName, '');
        newFileName = newFileName.trim();
        return `${newFileName}_${(0, generate_1.generateCode)(6)}${fileExt}`;
    }
    /**
     * 检查文件允许写入本地
     * @param fileName 原始文件名称含后缀，如：file_logo_xxw68.png
     * @param allowExts 允许上传拓展类型，['.png']
     * @returns 错误信息
     */
    isAllowWrite(fileName, allowExts) {
        /**最大文件名长度 */
        const DEFAULT_FILE_NAME_LENGTH = 100;
        // 判断上传文件名称长度
        if (fileName.length > DEFAULT_FILE_NAME_LENGTH) {
            return `上传文件名称长度限制最长为 ${DEFAULT_FILE_NAME_LENGTH}`;
        }
        // 判断文件拓展是否为允许的拓展类型
        const fileExt = (0, node_path_1.extname)(fileName);
        if (allowExts.length === 0) {
            allowExts = this.config.get('upload.whitelist');
        }
        let hasExt = false;
        for (const ext of allowExts) {
            if (ext === fileExt) {
                hasExt = true;
                break;
            }
        }
        if (!hasExt) {
            return `上传文件类型不支持，仅支持以下类型：${allowExts.join('、')}`;
        }
        return '';
    }
    /**
     * 检查文件允许本地读取
     * @param filePath 文件存放资源路径，URL相对地址
     * @returns 错误信息
     */
    isAllowRead(filePath) {
        // 禁止目录上跳级别
        if (filePath.indexOf('..') !== -1) {
            return '禁止目录上跳级别';
        }
        const uploadWhiteList = this.config.get('upload.whitelist');
        // 检查允许下载的文件规则
        const fileExt = (0, node_path_1.extname)(filePath);
        let hasExt = false;
        for (const str of uploadWhiteList) {
            if (str === fileExt) {
                hasExt = true;
                break;
            }
        }
        if (!hasExt) {
            if (fileExt === '') {
                return '未知异常文件';
            }
            return `限定下载的文件规则：${uploadWhiteList.join('、')}`;
        }
        return '';
    }
    /**
     * 上传资源文件读取
     * @param filePath 文件存放资源路径，URL相对地址 如：/upload/common/2023/06/xxx.png
     * @param headerRange 断点续传范围区间，bytes=0-12131
     * @return 结果 { fileSize, data, range, chunkSize }
     */
    async readUploadFileStream(filePath, headerRange) {
        // 检查文件允许访问
        const err = this.isAllowRead(filePath);
        if (err) {
            return [undefined, err];
        }
        // 上传资源路径
        const { prefix, dir } = this.config.get('staticFile.dirs.upload');
        const fileAsbPath = filePath.replace(prefix, dir);
        // 响应结果
        const result = {
            range: '',
            chunkSize: 0,
            fileSize: 0,
            data: null,
        };
        // 文件大小
        const fileSize = await (0, utils_1.getFileSize)(fileAsbPath);
        if (fileSize <= 0) {
            return [undefined, '文件不存在'];
        }
        result.fileSize = fileSize;
        if (headerRange) {
            const parts = headerRange.replace(/bytes=/, '').split('-');
            let start = parseInt(parts[0], 10);
            if (isNaN(start) || start > fileSize) {
                start = 0;
            }
            let end = parseInt(parts[1], 10);
            if (isNaN(end) || start > fileSize) {
                end = fileSize - 1;
            }
            if (start > end) {
                start = end;
            }
            // 分片结果
            result.range = `bytes ${start}-${end}/${fileSize}`;
            result.chunkSize = end - start + 1;
            const [byteArr, errMsg] = await (0, utils_1.getFileStream)(fileAsbPath, start, end);
            if (errMsg) {
                return [undefined, errMsg];
            }
            result.data = byteArr;
            return [result, ''];
        }
        const [byteArr, errMsg] = await (0, utils_1.getFileStream)(fileAsbPath, 0, fileSize);
        if (errMsg) {
            return [undefined, errMsg];
        }
        result.data = byteArr;
        return [result, ''];
    }
    /**
     * 上传资源文件转存
     * @param file 上传文件对象
     * @param subPath 子路径
     * @param allowExts 允许上传拓展类型（含“.”)，如 ['.png','.jpg']
     * @returns [文件存放资源路径，URL相对地址, 错误信息]
     */
    async transferUploadFile(file, subPath, allowExts = []) {
        // 上传文件检查
        const err = this.isAllowWrite(file.filename, allowExts);
        if (err) {
            return ['', err];
        }
        // 上传资源路径
        const { prefix, dir } = this.config.get('staticFile.dirs.upload');
        // 新文件名称并组装文件地址
        const fileName = this.generateFileName(file.filename);
        const fileDir = (0, node_path_1.normalize)((0, node_path_1.join)(subPath, (0, data_1.parseDatePath)()));
        const writeFilePath = (0, node_path_1.normalize)((0, node_path_1.join)(dir, fileDir));
        // 存入新文件路径
        const errMsg = await (0, utils_1.transferToNewFile)(file.data, writeFilePath, fileName);
        if (errMsg) {
            return ['', errMsg];
        }
        const upPath = (0, node_path_1.normalize)((0, node_path_1.join)(prefix, fileDir, fileName));
        return [upPath.replace(/\\/g, '/'), ''];
    }
    /**
     * 上传资源切片文件检查
     * @param identifier 切片文件目录标识符
     * @param originalFileName 原始文件名称，如logo.png
     * @returns [文件列表, 错误信息]
     */
    async chunkCheckFile(identifier, originalFileName) {
        const err = this.isAllowWrite(originalFileName, []);
        if (err) {
            return [[], err];
        }
        const uploadDir = this.config.get('staticFile.dirs.upload.dir');
        const dirPath = (0, node_path_1.normalize)((0, node_path_1.join)(upload_sub_path_1.UPLOAD_CHUNK, (0, data_1.parseDatePath)(), identifier));
        const readPath = (0, node_path_1.normalize)((0, node_path_1.join)(uploadDir, dirPath));
        const fileNameList = await (0, utils_1.getDirFileNameList)(readPath);
        return [fileNameList, ''];
    }
    /**
     * 上传资源切片文件合并
     * @param identifier 切片文件目录标识符
     * @param originalFileName 原始文件名称，如logo.png
     * @param subPath 子路径，默认 UploadSubPathEnum.DEFAULT
     * @returns 文件存放资源路径
     */
    async chunkMergeFile(identifier, originalFileName, subPath = upload_sub_path_1.UPLOAD_DEFAULT) {
        const err = this.isAllowWrite(originalFileName, []);
        if (err) {
            return ['', err];
        }
        // 上传资源路径
        const { prefix, dir } = this.config.get('staticFile.dirs.upload');
        // 切片存放目录
        const dirPath = (0, node_path_1.normalize)((0, node_path_1.join)(upload_sub_path_1.UPLOAD_CHUNK, (0, data_1.parseDatePath)(), identifier));
        const readPath = (0, node_path_1.normalize)((0, node_path_1.join)(dir, dirPath));
        // 组合存放文件路径
        const fileName = this.generateFileName(originalFileName);
        const fileDir = (0, node_path_1.normalize)((0, node_path_1.join)(subPath, (0, data_1.parseDatePath)()));
        const writePath = (0, node_path_1.normalize)((0, node_path_1.join)(dir, fileDir));
        const errMsg = await (0, utils_1.mergeToNewFile)(readPath, writePath, fileName);
        if (errMsg) {
            return ['', errMsg];
        }
        const upPath = (0, node_path_1.normalize)((0, node_path_1.join)(prefix, fileDir, fileName));
        return [upPath.replace(/\\/g, '/'), ''];
    }
    /**
     * 上传资源切片文件转存
     * @param file 上传文件对象
     * @param index 切片文件序号
     * @param identifier 切片文件目录标识符
     * @returns 文件存放资源路径，URL相对地址
     */
    async transferChunkUploadFile(file, index, identifier) {
        // 上传文件检查
        const err = this.isAllowWrite(file.filename, []);
        if (err) {
            return ['', err];
        }
        // 上传资源路径
        const { prefix, dir } = this.config.get('staticFile.dirs.upload');
        const fileDir = (0, node_path_1.normalize)((0, node_path_1.join)(upload_sub_path_1.UPLOAD_CHUNK, (0, data_1.parseDatePath)(), identifier));
        const writePath = (0, node_path_1.normalize)((0, node_path_1.join)(dir, fileDir));
        const errMsg = await (0, utils_1.transferToNewFile)(file.data, writePath, index);
        if (errMsg) {
            return ['', errMsg];
        }
        const upPath = (0, node_path_1.normalize)((0, node_path_1.join)(prefix, fileDir, index));
        return [upPath.replace(/\\/g, '/'), ''];
    }
    /**
     * 上传资源文件删除
     * @param filePath 文件存放资源路径，URL相对地址
     * @return 错误信息
     */
    async deleteUploadFile(filePath) {
        // 检查文件允许访问
        const err = this.isAllowRead(filePath);
        if (err) {
            return err;
        }
        // 上传资源路径
        const { prefix, dir } = this.config.get('staticFile.dirs.upload');
        const asbPath = filePath.replace(prefix, dir);
        const ok = await (0, utils_1.deleteFile)(asbPath);
        if (!ok) {
            return `文件 ${filePath} 删除失败。`;
        }
        return '';
    }
    /**
     * 内部文件读取 assets 目录
     * @param asserPath 内部文件相对地址，如：/template/excel/xxx.xlsx
     * @return [文件读取流, 错误信息]
     */
    async readAssetsFileStream(asserPath) {
        // 检查文件允许访问
        const err = this.isAllowRead(asserPath);
        if (err) {
            return [undefined, err];
        }
        const absPath = (0, node_path_1.resolve)(__dirname, '../../../assets', asserPath);
        return await (0, utils_1.getFileStream)(absPath);
    }
    /**
     * 上传资源本地绝对资源路径
     * @param filePath 上传文件路径
     * @return 绝对路径
     */
    parseUploadFileAbsPath(filePath) {
        // 上传资源路径
        const { prefix, dir } = this.config.get('staticFile.dirs.upload');
        return filePath.replace(prefix, dir);
    }
    /**
     * 表格读取数据， 只读第一张工作表
     * @param file 上传文件对象
     * @param sheetName 工作簿名称， 空字符默认Sheet1
     * @return 表格信息对象列表
     */
    async excelReadRecord(file, sheetName) {
        const { data, filename } = file;
        let err = this.isAllowWrite(filename, ['.xls', '.xlsx']);
        if (err) {
            return [undefined, err];
        }
        // 保存上传文件
        const uploadDir = this.config.get('staticFile.dirs.upload.dir');
        const fileDir = (0, node_path_1.normalize)((0, node_path_1.join)(uploadDir, upload_sub_path_1.UPLOAD_IMPORT, (0, data_1.parseDatePath)()));
        const fileName = this.generateFileName(filename);
        err = await (0, utils_1.transferToNewFile)(file.data, fileDir, fileName);
        if (err) {
            return [undefined, err];
        }
        // 读取数据
        return await (0, execl_1.readSheet)(data, sheetName);
    }
    /**
     * 表格写入数据并导出
     * @param data 写入数据
     * @param fileName 文件名 xxx_export_2424_1690964011598.xlsx
     * @param sheetName 工作表名称 默认Sheet1
     * @return xlsx文件流
     */
    async excelWriteRecord(data, fileName, sheetName = 'Sheet1') {
        const sheetBuffer = await (0, execl_1.writeSheet)(data, sheetName);
        // 上传资源路径
        const uploadDir = this.config.get('staticFile.dirs.upload.dir');
        // 保存文件
        if (fileName) {
            const fileDir = (0, node_path_1.normalize)((0, node_path_1.join)(uploadDir, upload_sub_path_1.UPLOAD_EXPORT, (0, data_1.parseDatePath)()));
            await (0, utils_1.writeBufferFile)(Buffer.from(sheetBuffer), fileDir, fileName);
        }
        return sheetBuffer;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", config_1.GlobalConfig)
], FileUtil.prototype, "config", void 0);
exports.FileUtil = FileUtil = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], FileUtil);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvdXRpbHMvZmlsZS9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE4RDtBQUU5RCx5Q0FBNEQ7QUFHNUQsbUNBUWlCO0FBQ2pCLHFFQUt5QztBQUN6QyxnREFBNkM7QUFDN0MsdUNBQTZDO0FBQzdDLG1DQUFnRDtBQUNoRCxtREFBb0Q7QUFDcEQsZ0RBQW1EO0FBRW5ELGlCQUFpQjtBQUdWLElBQU0sUUFBUSxzQkFBZCxNQUFNLFFBQVE7SUFDbkIsVUFBVTtJQUVGLE1BQU0sQ0FBZTtJQUU3Qjs7OztPQUlHO0lBQ0ssZ0JBQWdCLENBQUMsUUFBZ0I7UUFDdkMsTUFBTSxPQUFPLEdBQUcsSUFBQSxtQkFBTyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLGtCQUFrQjtRQUNsQixJQUFJLFdBQVcsR0FBRyxJQUFBLGlCQUFPLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqRCxXQUFXLEdBQUcsSUFBQSxpQkFBTyxFQUFDLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMxRCxXQUFXLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pDLE9BQU8sR0FBRyxXQUFXLElBQUksSUFBQSx1QkFBWSxFQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNLLFlBQVksQ0FBQyxRQUFnQixFQUFFLFNBQW1CO1FBQ3hELGFBQWE7UUFDYixNQUFNLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztRQUNyQyxhQUFhO1FBQ2IsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLHdCQUF3QixFQUFFO1lBQzlDLE9BQU8saUJBQWlCLHdCQUF3QixFQUFFLENBQUM7U0FDcEQ7UUFFRCxtQkFBbUI7UUFDbkIsTUFBTSxP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