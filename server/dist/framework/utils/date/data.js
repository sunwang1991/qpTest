"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffSeconds = exports.parseDatePath = exports.parseDateToStr = exports.parseStrToDate = exports.YYYY_MM_DD_HH_MM_SS = exports.YYYYMMDDHHMMSS = exports.YYYY_MM_DD = exports.YYYY_MM = exports.YYYY = void 0;
// 依赖来源 https://github.com/iamkun/dayjs
const dayjs = require("dayjs");
// 导入本地化语言并设为默认使用
require('dayjs/locale/zh-cn');
dayjs.locale('zh-cn');
/**年 列如：2022 */
exports.YYYY = 'YYYY';
/**年-月 列如：2022-12 */
exports.YYYY_MM = 'YYYY-MM';
/**年-月-日 列如：2022-12-30 */
exports.YYYY_MM_DD = 'YYYY-MM-DD';
/**年月日时分秒 列如：20221230010159 */
exports.YYYYMMDDHHMMSS = 'YYYYMMDDHHmmss';
/**年-月-日 时:分:秒 列如：2022-12-30 01:01:59 */
exports.YYYY_MM_DD_HH_MM_SS = 'YYYY-MM-DD HH:mm:ss';
/**
 * 格式时间字符串
 * @param dateStr 时间字符串
 * @param formatStr 时间格式 默认YYYY-MM-DD HH:mm:ss
 * @returns Date对象
 */
function parseStrToDate(dateStr, formatStr = exports.YYYY_MM_DD_HH_MM_SS) {
    return dayjs(dateStr, formatStr).toDate();
}
exports.parseStrToDate = parseStrToDate;
/**
 * 格式时间
 * @param date 可转的Date对象
 * @param formatStr 时间格式 默认YYYY-MM-DD HH:mm:ss
 * @returns 时间格式字符串
 */
function parseDateToStr(date, formatStr = exports.YYYY_MM_DD_HH_MM_SS) {
    return dayjs(date).format(formatStr);
}
exports.parseDateToStr = parseDateToStr;
/**
 * 格式时间成日期路径
 *
 * 年/月 列如：2022/12
 * @returns 时间格式字符串 YYYY/MM
 */
function parseDatePath(date = Date.now()) {
    return dayjs(date).format('YYYY/MM');
}
exports.parseDatePath = parseDatePath;
/**
 * 判断两次时间差
 * @param endDate 结束时间
 * @param startDate 开始时间
 * @returns 单位秒
 */
function diffSeconds(endDate, startDate) {
    const value = Math.ceil(dayjs(endDate).diff(startDate, 'seconds'));
    if (Number.isNaN(value))
        return 0;
    return value;
}
exports.diffSeconds = diffSeconds;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvdXRpbHMvZGF0ZS9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUF1QztBQUN2QywrQkFBZ0M7QUFDaEMsaUJBQWlCO0FBQ2pCLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzlCLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFdEIsZUFBZTtBQUNGLFFBQUEsSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUUzQixvQkFBb0I7QUFDUCxRQUFBLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFakMseUJBQXlCO0FBQ1osUUFBQSxVQUFVLEdBQUcsWUFBWSxDQUFDO0FBRXZDLDhCQUE4QjtBQUNqQixRQUFBLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQztBQUUvQyx3Q0FBd0M7QUFDM0IsUUFBQSxtQkFBbUIsR0FBRyxxQkFBcUIsQ0FBQztBQUV6RDs7Ozs7R0FLRztBQUNILFNBQWdCLGNBQWMsQ0FDNUIsT0FBZSxFQUNmLFlBQW9CLDJCQUFtQjtJQUV2QyxPQUFPLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDNUMsQ0FBQztBQUxELHdDQUtDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixjQUFjLENBQzVCLElBQTRCLEVBQzVCLFlBQW9CLDJCQUFtQjtJQUV2QyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUxELHdDQUtDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixhQUFhLENBQUMsT0FBc0IsSUFBSSxDQUFDLEdBQUcsRUFBRTtJQUM1RCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELHNDQUVDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixXQUFXLENBQ3pCLE9BQXNCLEVBQ3RCLFNBQXdCO0lBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNuRSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEMsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBUEQsa0NBT0MifQ==