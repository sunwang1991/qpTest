/// <reference types="node" />
/// <reference types="node" />
/**
 * 读取文件大小
 * @param filePath 文件路径
 * @return 文件大小，单位B
 */
export declare function getFileSize(filePath: string): Promise<number>;
/**
 * 判断文件是否存在
 * @param filePath 文件路径
 * @return 错误信息，空字符串表示文件存在
 */
export declare function checkExists(filePath: string): Promise<string>;
/**
 * 判断文件夹是否存在，不存在则创建
 * @param dirPath 文件路径目录
 * @return 错误信息，空字符串表示文件夹存在
 */
export declare function checkDirPathExists(dirPath: string): Promise<string>;
/**
 * 删除文件或文件夹
 * @param absPath 文件绝对路径
 * @return 布尔结果 true/false
 */
export declare function deleteFile(absPath: string): Promise<boolean>;
/**
 * 读取文件流用于返回下载
 * @param filePath 文件路径
 * @param startOffset 分片块读取开始区间，根据文件切片的块范围
 * @param endOffset 分片块读取结束区间，根据文件切片的块范围
 * @return [文件流数据，错误信息]
 */
export declare function getFileStream(filePath: string, startOffset?: number, endOffset?: number): Promise<[Buffer, string]>;
/**
 * 获取文件目录下所有文件名称，不含目录名称
 * @param filePath 文件路径
 * @return 文件名称列表
 */
export declare function getDirFileNameList(dirPath: string): Promise<string[]>;
/**
 * 二进制数据写入并生成文件
 * @param buf 二进制文件流
 * @param writeDirPath 写入目录路径
 * @param fileName 文件名称
 * @return 文件名
 */
export declare function writeBufferFile(buf: Buffer, writeDirPath: string, fileName: string): Promise<string>;
/**
 * 读取目标文件转移到新路径下
 *
 * @param srcPath 读取目标文件
 * @param writePath 输出文件路径
 * @param writefileName 输出文件名称
 * @return 错误信息
 */
export declare function transferToNewFile(filePath: string, writePath: string, writefileName: string): Promise<string>;
/**
 * 将多个文件合并成一个文件并删除合并前的切片目录文件
 *
 * @param dirPath 读取要合并文件的目录
 * @param writePath 写入路径
 * @param fileName 新文件名称
 * @return 错误信息
 */
export declare function mergeToNewFile(dirPath: string, writePath: string, fileName: string): Promise<string>;
