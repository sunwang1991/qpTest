/// <reference types="node" />
/// <reference types="node" />
import { UploadFileInfo } from '@midwayjs/upload';
/**File文件工具验证处理*/
export declare class FileUtil {
    /**配置信息 */
    private config;
    /**
     * 生成文件名称
     * @param fileName 原始文件名称含后缀，如：logo.png
     * @returns fileName_随机值.extName
     */
    private generateFileName;
    /**
     * 检查文件允许写入本地
     * @param fileName 原始文件名称含后缀，如：file_logo_xxw68.png
     * @param allowExts 允许上传拓展类型，['.png']
     * @returns 错误信息
     */
    private isAllowWrite;
    /**
     * 检查文件允许本地读取
     * @param filePath 文件存放资源路径，URL相对地址
     * @returns 错误信息
     */
    private isAllowRead;
    /**
     * 上传资源文件读取
     * @param filePath 文件存放资源路径，URL相对地址 如：/upload/common/2023/06/xxx.png
     * @param headerRange 断点续传范围区间，bytes=0-12131
     * @return 结果 { fileSize, data, range, chunkSize }
     */
    readUploadFileStream(filePath: string, headerRange: string): Promise<[Record<string, any>, string]>;
    /**
     * 上传资源文件转存
     * @param file 上传文件对象
     * @param subPath 子路径
     * @param allowExts 允许上传拓展类型（含“.”)，如 ['.png','.jpg']
     * @returns [文件存放资源路径，URL相对地址, 错误信息]
     */
    transferUploadFile(file: UploadFileInfo<string>, subPath: string, allowExts?: string[]): Promise<[string, string]>;
    /**
     * 上传资源切片文件检查
     * @param identifier 切片文件目录标识符
     * @param originalFileName 原始文件名称，如logo.png
     * @returns [文件列表, 错误信息]
     */
    chunkCheckFile(identifier: string, originalFileName: string): Promise<[string[], string]>;
    /**
     * 上传资源切片文件合并
     * @param identifier 切片文件目录标识符
     * @param originalFileName 原始文件名称，如logo.png
     * @param subPath 子路径，默认 UploadSubPathEnum.DEFAULT
     * @returns 文件存放资源路径
     */
    chunkMergeFile(identifier: string, originalFileName: string, subPath?: string): Promise<[string, string]>;
    /**
     * 上传资源切片文件转存
     * @param file 上传文件对象
     * @param index 切片文件序号
     * @param identifier 切片文件目录标识符
     * @returns 文件存放资源路径，URL相对地址
     */
    transferChunkUploadFile(file: UploadFileInfo<string>, index: string, identifier: string): Promise<[string, string]>;
    /**
     * 上传资源文件删除
     * @param filePath 文件存放资源路径，URL相对地址
     * @return 错误信息
     */
    deleteUploadFile(filePath: string): Promise<string>;
    /**
     * 内部文件读取 assets 目录
     * @param asserPath 内部文件相对地址，如：/template/excel/xxx.xlsx
     * @return [文件读取流, 错误信息]
     */
    readAssetsFileStream(asserPath: string): Promise<[Buffer, string]>;
    /**
     * 上传资源本地绝对资源路径
     * @param filePath 上传文件路径
     * @return 绝对路径
     */
    parseUploadFileAbsPath(filePath: string): string;
    /**
     * 表格读取数据， 只读第一张工作表
     * @param file 上传文件对象
     * @param sheetName 工作簿名称， 空字符默认Sheet1
     * @return 表格信息对象列表
     */
    excelReadRecord(file: UploadFileInfo<string>, sheetName: string): Promise<[Record<string, string>[], string]>;
    /**
     * 表格写入数据并导出
     * @param data 写入数据
     * @param fileName 文件名 xxx_export_2424_1690964011598.xlsx
     * @param sheetName 工作表名称 默认Sheet1
     * @return xlsx文件流
     */
    excelWriteRecord(data: any[], fileName?: string, sheetName?: string): Promise<import("exceljs").Buffer>;
}
