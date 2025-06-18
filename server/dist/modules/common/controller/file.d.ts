import { UploadFileInfo } from '@midwayjs/upload';
/**文件操作 控制层处理*/
export declare class FileController {
    /**上下文 */
    private c;
    /**文件服务 */
    private fileUtil;
    /**下载文件 */
    download(filePath: string): Promise<{
        code: number;
        msg: string;
    }>;
    /**上传文件 */
    upload(files: UploadFileInfo<string>[], subPath: string): Promise<{
        code: number;
        msg: string;
    }>;
    /**切片文件检查 */
    chunkCheck(
    /**唯一标识 */
    identifier: string, 
    /**文件名 */
    fileName: string): Promise<{
        code: number;
        msg: string;
    }>;
    /**切片文件合并 */
    chunkMerge(
    /**唯一标识 */
    identifier: string, 
    /**文件名 */
    fileName: string, 
    /**子路径类型 */
    subPath: string): Promise<{
        code: number;
        msg: string;
    }>;
    /**切片文件上传 */
    chunkUpload(
    /**上传的文件 */
    files: UploadFileInfo<string>[], 
    /**切片编号 */
    index: string, 
    /**切片唯一标识 */
    identifier: string): Promise<{
        code: number;
        msg: string;
    }>;
}
