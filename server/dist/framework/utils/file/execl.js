"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSheet = exports.readSheet = void 0;
const exceljs_1 = require("exceljs");
/**
 * 读取表格数据
 * @param filePath 文件路径
 * @param sheetName 工作簿名称， 空字符默认Sheet1
 * @return [表格列表, 错误信息]
 */
async function readSheet(filePath, sheetName = 'Sheet1') {
    // 读取Excel文件
    const workbook = new exceljs_1.Workbook();
    await workbook.xlsx.readFile(filePath);
    // 获取工作表
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
        return [[], `Sheet "${sheetName}" not found`];
    }
    // 获取表头行
    const headerRow = worksheet.getRow(1);
    // 获取表头列数
    const headerColumnCount = headerRow.cellCount;
    //  定义表内数据数组
    const rowDataArr = [];
    for (let i = 2; i <= worksheet.rowCount; i++) {
        // 获取当前数据行
        const dataRow = worksheet.getRow(i);
        // 定义一个空对象来存储当前行的数据
        const rowData = {};
        // 遍历当前数据行的每一列
        for (let j = 1; j <= headerColumnCount; j++) {
            // 获取当前列的表头名称
            const headerName = headerRow.getCell(j).value?.toString() || `${j}`;
            // 获取当前列的数据值
            const cellValue = dataRow.getCell(j).value?.toString() || '';
            // 将当前列的数据值添加到当前数据对象中
            rowData[headerName] = cellValue;
        }
        // 将当前行的数据存储到data数组中
        rowDataArr.push(rowData);
    }
    return [rowDataArr, ''];
}
exports.readSheet = readSheet;
/**
 * 写入表格数据并导出
 * @param filePath 文件路径
 * @param sheetName 工作表名称
 * @return xlsx文件流
 */
async function writeSheet(data, sheetName) {
    const workbook = new exceljs_1.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    // header表头名称用数据key, width设置列宽度，单位厘米
    worksheet.columns = Object.keys(data[0]).map(key => {
        return { header: key, key, width: 20 };
    });
    // 写入数据
    worksheet.addRows(data);
    // 得到arrayBuffer数据
    return await workbook.xlsx.writeBuffer();
}
exports.writeSheet = writeSheet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZnJhbWV3b3JrL3V0aWxzL2ZpbGUvZXhlY2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQW1DO0FBRW5DOzs7OztHQUtHO0FBQ0ksS0FBSyxVQUFVLFNBQVMsQ0FDN0IsUUFBZ0IsRUFDaEIsU0FBUyxHQUFHLFFBQVE7SUFFcEIsWUFBWTtJQUNaLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBRSxDQUFDO0lBQ2hDLE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsUUFBUTtJQUNSLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkQsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLE9BQU8sQ0FBQyxFQUFFLEVBQUUsVUFBVSxTQUFTLGFBQWEsQ0FBQyxDQUFDO0tBQy9DO0lBQ0QsUUFBUTtJQUNSLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEMsU0FBUztJQUNULE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUM5QyxZQUFZO0lBQ1osTUFBTSxVQUFVLEdBQTBCLEVBQUUsQ0FBQztJQUM3QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM1QyxVQUFVO1FBQ1YsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxtQkFBbUI7UUFDbkIsTUFBTSxPQUFPLEdBQXdCLEVBQUUsQ0FBQztRQUN4QyxjQUFjO1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGlCQUFpQixFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLGFBQWE7WUFDYixNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3BFLFlBQVk7WUFDWixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDN0QscUJBQXFCO1lBQ3JCLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxTQUFTLENBQUM7U0FDakM7UUFDRCxvQkFBb0I7UUFDcEIsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMxQjtJQUNELE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQXBDRCw4QkFvQ0M7QUFFRDs7Ozs7R0FLRztBQUNJLEtBQUssVUFBVSxVQUFVLENBQUMsSUFBVyxFQUFFLFNBQWlCO0lBQzdELE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBRSxDQUFDO0lBQ2hDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFbkQsb0NBQW9DO0lBQ3BDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDakQsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLGtCQUFrQjtJQUNsQixPQUFPLE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMzQyxDQUFDO0FBYkQsZ0NBYUMifQ==