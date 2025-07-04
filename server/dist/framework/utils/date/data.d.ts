/**年 列如：2022 */
export declare const YYYY = "YYYY";
/**年-月 列如：2022-12 */
export declare const YYYY_MM = "YYYY-MM";
/**年-月-日 列如：2022-12-30 */
export declare const YYYY_MM_DD = "YYYY-MM-DD";
/**年月日时分秒 列如：20221230010159 */
export declare const YYYYMMDDHHMMSS = "YYYYMMDDHHmmss";
/**年-月-日 时:分:秒 列如：2022-12-30 01:01:59 */
export declare const YYYY_MM_DD_HH_MM_SS = "YYYY-MM-DD HH:mm:ss";
/**
 * 格式时间字符串
 * @param dateStr 时间字符串
 * @param formatStr 时间格式 默认YYYY-MM-DD HH:mm:ss
 * @returns Date对象
 */
export declare function parseStrToDate(dateStr: string, formatStr?: string): Date;
/**
 * 格式时间
 * @param date 可转的Date对象
 * @param formatStr 时间格式 默认YYYY-MM-DD HH:mm:ss
 * @returns 时间格式字符串
 */
export declare function parseDateToStr(date: string | number | Date, formatStr?: string): string;
/**
 * 格式时间成日期路径
 *
 * 年/月 列如：2022/12
 * @returns 时间格式字符串 YYYY/MM
 */
export declare function parseDatePath(date?: number | Date): string;
/**
 * 判断两次时间差
 * @param endDate 结束时间
 * @param startDate 开始时间
 * @returns 单位秒
 */
export declare function diffSeconds(endDate: number | Date, startDate: number | Date): number;
