/**
 * 解析数值型
 * @param value 值
 */
export declare function parseNumber(value: any): number;
/**
 * 解析布尔型
 * @param value 值
 */
export declare function parseBoolean(value: any): boolean;
/**
 * 字符串转换驼峰形式
 * @param str 字符串 dict/inline/data/:dictId
 * @returns 结果 DictInlineDataDictId
 */
export declare function ConvertToCamelCase(str: string): string;
/**
 * 解析下划线转驼峰
 * @param str 字符串 a_b
 * @returns  驼峰风格 aB
 */
export declare function parseStrLineToHump(str: string): string;
/**
 * 解析驼峰转下划线
 * @param str 字符串 aB
 * @returns  下划线风格 a_b
 */
export declare function parseStrHumpToLine(str: string): string;
/**
 * 对象的key值驼峰转下划线
 * @param obj 对象属性 字符数组orJSON对象
 * @returns 驼峰转下划线
 */
export declare function parseObjHumpToLine(obj: any): any;
/**
 * 对象的key值下划线转驼峰
 * @param obj 对象属性 字符数组orJSON对象
 * @returns 下划线转驼峰
 */
export declare function parseObjLineToHump(obj: any): any;
/**
 * 解析格式化json字符串
 *
 * @param str JSON字符串
 * @returns false时为非标准json对象
 */
export declare function parseStringToObject(str: string): Record<string, any> | null;
/**
 * 解析 Cron 表达式，返回下一次执行的时间戳（毫秒）
 * @param {string} cron Cron 表达式
 * @returns {number} 下一次执行的时间戳（毫秒），如果解析失败则返回 0
 */
export declare function parseCronExpression(cron: string): number;
/**
 * 解析比特位为单位
 * @param bit 数值大小B
 * @returns GB MB KB B
 */
export declare function parseBit(bit: number): string;
/**
 * 解析掩码内容值
 * @param value 内容值字符串
 * @returns 掩码 ******2
 */
export declare function parseSafeContent(value?: string): string;
/**
 * 解析数据层级转树结构
 *
 * @param data 数组数据
 * @param fieldId 读取节点字段 默认 'id'
 * @param fieldParentId 读取节点父节点字段 默认 'parentId'
 * @param fieldChildren 设置子节点字段 默认 'children'
 * @returns 层级数组
 */
export declare function parseDataToTree<T>(data: T[], fieldId?: string, fieldParentId?: string, fieldChildren?: string): T[];
/**
 * 解析掩码手机号
 * @param mobile 11位手机号 字符串
 * @returns 掩码 136****2738
 */
export declare function parseMaskMobile(mobile: string): string;
/**
 * 解析掩码邮箱号
 * @param email 邮箱号 字符串
 * @returns 掩码 123****@
 */
export declare function parseMaskEmail(email: string): string;
/**
 * 解析字符串数组去重
 * @param arr 字符串数组
 * @returns 字符串数组
 */
export declare function parseRemoveDuplicates(arr: string[]): string[];
/**
 * 解析字符串分隔去重转为字符数组
 * @param keyStr 字符串，逗号分隔符分隔的字符串
 * @param sep 分隔符，默认逗号
 * @returns 字符数组
 */
export declare function parseRemoveDuplicatesToArray(keyStr: string, sep?: string): string[];
