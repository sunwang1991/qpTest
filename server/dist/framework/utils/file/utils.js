"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeToNewFile = exports.transferToNewFile = exports.writeBufferFile = exports.getDirFileNameList = exports.getFileStream = exports.deleteFile = exports.checkDirPathExists = exports.checkExists = exports.getFileSize = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
/**
 * 读取文件大小
 * @param filePath 文件路径
 * @return 文件大小，单位B
 */
async function getFileSize(filePath) {
    // 获取文件信息
    let fileInfo = null;
    try {
        fileInfo = await (0, promises_1.stat)(filePath);
    }
    catch (error) {
        console.error(`failed stat ${filePath} : ${error.message}`);
        return -1;
    }
    // 获取文件大小（字节数）
    return fileInfo.size;
}
exports.getFileSize = getFileSize;
/**
 * 判断文件是否存在
 * @param filePath 文件路径
 * @return 错误信息，空字符串表示文件存在
 */
async function checkExists(filePath) {
    try {
        await (0, promises_1.access)(filePath, promises_1.constants.F_OK);
        return '';
    }
    catch (error) {
        console.error(`failed access error: ${error.message}`);
        return error.message;
    }
}
exports.checkExists = checkExists;
/**
 * 判断文件夹是否存在，不存在则创建
 * @param dirPath 文件路径目录
 * @return 错误信息，空字符串表示文件夹存在
 */
async function checkDirPathExists(dirPath) {
    try {
        await (0, promises_1.access)(dirPath, promises_1.constants.F_OK);
        return '';
    }
    catch (error) {
        try {
            await (0, promises_1.mkdir)(dirPath, { recursive: true });
            console.warn(`failed access to mkdir error: ${error.message}`);
            return '';
        }
        catch (e) {
            console.error(`failed mkdir error: ${e.message}`);
            return error.message;
        }
    }
}
exports.checkDirPathExists = checkDirPathExists;
/**
 * 删除文件或文件夹
 * @param absPath 文件绝对路径
 * @return 布尔结果 true/false
 */
async function deleteFile(absPath) {
    if (!absPath)
        return false;
    try {
        const stats = await (0, promises_1.stat)(absPath);
        if (stats.isFile()) {
            await (0, promises_1.unlink)(absPath);
            return true;
        }
        if (stats.isDirectory()) {
            await (0, promises_1.rmdir)(absPath);
            return true;
        }
    }
    catch (error) {
        console.error(`failed delete "${absPath}": ${error.message}`);
    }
    return false;
}
exports.deleteFile = deleteFile;
/**
 * 读取文件流用于返回下载
 * @param filePath 文件路径
 * @param startOffset 分片块读取开始区间，根据文件切片的块范围
 * @param endOffset 分片块读取结束区间，根据文件切片的块范围
 * @return [文件流数据，错误信息]
 */
async function getFileStream(filePath, startOffset = 0, endOffset = -1) {
    let fd = null;
    try {
        // 打开文件
        fd = await (0, promises_1.open)(filePath, 'r');
        // 获取文件的大小
        const fileInfo = await fd.stat();
        const fileSize = fileInfo.size;
        // 确保起始和结束偏移量在文件范围内
        startOffset = Math.max(0, Math.min(startOffset, fileSize - 1));
        endOffset = Math.min(endOffset < 0 ? fileSize - 1 : endOffset, fileSize - 1);
        // 计算切片的大小
        const chunkSize = endOffset - startOffset + 1;
        // 创建一个缓冲区来存储读取的数据
        const buffer = Buffer.alloc(chunkSize);
        await fd.read(buffer, 0, chunkSize, startOffset);
        return [buffer, ''];
    }
    catch (error) {
        console.error(`failed ${filePath} err: ${error.message}`);
        return [null, error.message];
    }
    finally {
        if (fd) {
            await fd.close();
        }
    }
}
exports.getFileStream = getFileStream;
/**
 * 获取文件目录下所有文件名称，不含目录名称
 * @param filePath 文件路径
 * @return 文件名称列表
 */
async function getDirFileNameList(dirPath) {
    if (!dirPath)
        return [];
    try {
        const dir = await (0, promises_1.opendir)(dirPath);
        const fileNames = [];
        for await (const dirent of dir) {
            if (dirent.isFile()) {
                fileNames.push(dirent.name);
            }
        }
        return fileNames;
    }
    catch (error) {
        console.error(`failed opendir "${dirPath}": ${error.message}`);
        return [];
    }
}
exports.getDirFileNameList = getDirFileNameList;
/**
 * 二进制数据写入并生成文件
 * @param buf 二进制文件流
 * @param writeDirPath 写入目录路径
 * @param fileName 文件名称
 * @return 文件名
 */
async function writeBufferFile(buf, writeDirPath, fileName) {
    await checkDirPathExists(writeDirPath);
    const filePath = (0, node_path_1.normalize)((0, node_path_1.join)(writeDirPath, fileName));
    // 写入到新路径文件
    try {
        await (0, promises_1.writeFile)(filePath, buf);
    }
    catch (error) {
        console.error(`failed write file "${filePath}": ${error.message}`);
    }
    return filePath;
}
exports.writeBufferFile = writeBufferFile;
/**
 * 读取目标文件转移到新路径下
 *
 * @param srcPath 读取目标文件
 * @param writePath 输出文件路径
 * @param writefileName 输出文件名称
 * @return 错误信息
 */
async function transferToNewFile(filePath, writePath, writefileName) {
    let err = await checkExists(filePath);
    if (err) {
        return err;
    }
    err = await checkDirPathExists(writePath);
    if (err) {
        return err;
    }
    // 写入到新路径文件
    const newFilePath = (0, node_path_1.normalize)((0, node_path_1.join)(writePath, writefileName));
    try {
        // 读取文件转移到新路径文件
        const data = await (0, promises_1.readFile)(filePath);
        await (0, promises_1.writeFile)(newFilePath, data);
        return '';
    }
    catch (error) {
        console.error(`failed transfer file "${newFilePath}": ${error.message}`);
        return error.message;
    }
}
exports.transferToNewFile = transferToNewFile;
/**
 * 将多个文件合并成一个文件并删除合并前的切片目录文件
 *
 * @param dirPath 读取要合并文件的目录
 * @param writePath 写入路径
 * @param fileName 新文件名称
 * @return 错误信息
 */
async function mergeToNewFile(dirPath, writePath, fileName) {
    // 读取目录下所有文件并排序，注意文件名称是否数值
    const fileNameList = await getDirFileNameList((0, node_path_1.normalize)(dirPath));
    if (fileNameList.length <= 0) {
        return '读取合并目标文件失败';
    }
    fileNameList.sort((a, b) => parseInt(a) - parseInt(b));
    const errMsg = await checkDirPathExists(writePath);
    if (errMsg) {
        return errMsg;
    }
    // 读取文件转移到新路径文件
    const newFilePath = (0, node_path_1.normalize)((0, node_path_1.join)(writePath, fileName));
    try {
        // 逐个读取文件组合数据块
        const fileBuffers = [];
        for (const fileName of fileNameList) {
            const chunkPath = (0, node_path_1.normalize)((0, node_path_1.join)(dirPath, fileName));
            const buffer = await (0, promises_1.readFile)(chunkPath);
            fileBuffers.push(buffer);
            await deleteFile(chunkPath);
        }
        // 写入新文件
        await (0, promises_1.writeFile)(newFilePath, Buffer.concat(fileBuffers));
        return '';
    }
    catch (error) {
        console.error(`failed merge file "${newFilePath}": ${error.message}`);
        return error.message;
    }
    finally {
        await deleteFile(dirPath);
    }
}
exports.mergeToNewFile = mergeToNewFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZnJhbWV3b3JrL3V0aWxzL2ZpbGUvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBWTBCO0FBRTFCLHlDQUE0QztBQUU1Qzs7OztHQUlHO0FBQ0ksS0FBSyxVQUFVLFdBQVcsQ0FBQyxRQUFnQjtJQUNoRCxTQUFTO0lBQ1QsSUFBSSxRQUFRLEdBQVUsSUFBSSxDQUFDO0lBQzNCLElBQUk7UUFDRixRQUFRLEdBQUcsTUFBTSxJQUFBLGVBQUksRUFBQyxRQUFRLENBQUMsQ0FBQztLQUNqQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLFFBQVEsTUFBTSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ1g7SUFDRCxjQUFjO0lBQ2QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLENBQUM7QUFYRCxrQ0FXQztBQUVEOzs7O0dBSUc7QUFDSSxLQUFLLFVBQVUsV0FBVyxDQUFDLFFBQWdCO0lBQ2hELElBQUk7UUFDRixNQUFNLElBQUEsaUJBQU0sRUFBQyxRQUFRLEVBQUUsb0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN2RCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUM7S0FDdEI7QUFDSCxDQUFDO0FBUkQsa0NBUUM7QUFFRDs7OztHQUlHO0FBQ0ksS0FBSyxVQUFVLGtCQUFrQixDQUFDLE9BQWU7SUFDdEQsSUFBSTtRQUNGLE1BQU0sSUFBQSxpQkFBTSxFQUFDLE9BQU8sRUFBRSxvQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RD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