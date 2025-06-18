/**
 * 读取表格数据
 * @param filePath 文件路径
 * @param sheetName 工作簿名称， 空字符默认Sheet1
 * @return [表格列表, 错误信息]
 */
export declare function readSheet(filePath: string, sheetName?: string): Promise<[Record<string, string>[], string]>;
/**
 * 写入表格数据并导出
 * @param filePath 文件路径
 * @param sheetName 工作表名称
 * @return xlsx文件流
 */
export declare function writeSheet(data: any[], sheetName: string): Promise<import("exceljs").Buffer>;
