"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRemoveDuplicatesToArray = exports.parseRemoveDuplicates = exports.parseMaskEmail = exports.parseMaskMobile = exports.parseDataToTree = exports.parseSafeContent = exports.parseBit = exports.parseCronExpression = exports.parseStringToObject = exports.parseObjLineToHump = exports.parseObjHumpToLine = exports.parseStrHumpToLine = exports.parseStrLineToHump = exports.ConvertToCamelCase = exports.parseBoolean = exports.parseNumber = void 0;
const cron_parser_1 = require("cron-parser");
/**
 * 解析数值型
 * @param value 值
 */
function parseNumber(value) {
    if (typeof value === 'number')
        return value;
    if (typeof value === 'boolean') {
        return Number(value);
    }
    if (typeof value === 'string') {
        const v = Number(value);
        if (!isNaN(v))
            return v;
        return 0;
    }
    return 0;
}
exports.parseNumber = parseNumber;
/**
 * 解析布尔型
 * @param value 值
 */
function parseBoolean(value) {
    if (typeof value === 'number') {
        return value > 0 ? true : false;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        if (value === 'false' || value === '0' || value.trim().length === 0) {
            return false;
        }
        return Boolean(value);
    }
    return false;
}
exports.parseBoolean = parseBoolean;
/**
 * 字符串转换驼峰形式
 * @param str 字符串 dict/inline/data/:dictId
 * @returns 结果 DictInlineDataDictId
 */
function ConvertToCamelCase(str) {
    if (!str)
        return str;
    const reg = /[-_:/]\w/g;
    const output = str.replace(reg, (match) => match[1].toUpperCase());
    const words = output.split(/\b/).filter(w => /\w/.test(w));
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        const firstChar = word.substring(0, 1);
        word = word.substring(1).replace(/\//g, '');
        words[i] = firstChar.toUpperCase() + word;
    }
    return words.join('');
}
exports.ConvertToCamelCase = ConvertToCamelCase;
/**
 * 解析下划线转驼峰
 * @param str 字符串 a_b
 * @returns  驼峰风格 aB
 */
function parseStrLineToHump(str) {
    if (!str)
        return str;
    return str.replace(/_(\w)/g, (_item, letter) => letter.toUpperCase());
}
exports.parseStrLineToHump = parseStrLineToHump;
/**
 * 解析驼峰转下划线
 * @param str 字符串 aB
 * @returns  下划线风格 a_b
 */
function parseStrHumpToLine(str) {
    if (!str)
        return str;
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}
exports.parseStrHumpToLine = parseStrHumpToLine;
/**
 * 对象的key值驼峰转下划线
 * @param obj 对象属性 字符数组orJSON对象
 * @returns 驼峰转下划线
 */
function parseObjHumpToLine(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(v => parseObjHumpToLine(v));
    }
    if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            const new_key = parseStrHumpToLine(key);
            if (new_key !== key) {
                obj[new_key] = obj[key];
                delete obj[key];
            }
            obj[new_key] = parseObjHumpToLine(obj[new_key]);
        });
        return obj;
    }
    return obj;
}
exports.parseObjHumpToLine = parseObjHumpToLine;
/**
 * 对象的key值下划线转驼峰
 * @param obj 对象属性 字符数组orJSON对象
 * @returns 下划线转驼峰
 */
function parseObjLineToHump(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(v => parseObjLineToHump(v));
    }
    if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            const new_key = parseStrLineToHump(key);
            if (new_key !== key) {
                obj[new_key] = obj[key];
                delete obj[key];
            }
            obj[new_key] = parseObjLineToHump(obj[new_key]);
        });
        return obj;
    }
    return obj;
}
exports.parseObjLineToHump = parseObjLineToHump;
/**
 * 解析格式化json字符串
 *
 * @param str JSON字符串
 * @returns false时为非标准json对象
 */
function parseStringToObject(str) {
    try {
        const obj = JSON.parse(str);
        if (typeof obj === 'object' && obj !== null) {
            return obj;
        }
    }
    catch (error) {
        console.error(`failed parse json "${str}": ${error.message}`);
    }
    return null;
}
exports.parseStringToObject = parseStringToObject;
/**
 * 解析 Cron 表达式，返回下一次执行的时间戳（毫秒）
 * @param {string} cron Cron 表达式
 * @returns {number} 下一次执行的时间戳（毫秒），如果解析失败则返回 0
 */
function parseCronExpression(cron) {
    try {
        const interval = cron_parser_1.CronExpressionParser.parse(cron);
        return interval.next().getTime();
    }
    catch (err) {
        console.error(`failed parse cron "${cron}": ${err.message}`);
        return 0;
    }
}
exports.parseCronExpression = parseCronExpression;
/**
 * 解析比特位为单位
 * @param bit 数值大小B
 * @returns GB MB KB B
 */
function parseBit(bit) {
    let GB = '';
    let MB = '';
    let KB = '';
    bit > 1 << 30 && (GB = Number(bit / (1 << 30)).toFixed(2));
    bit > 1 << 20 && bit < 1 << 30 && (MB = Number(bit / (1 << 20)).toFixed(2));
    bit > 1 << 10 && bit > 1 << 20 && (KB = Number(bit / (1 << 10)).toFixed(2));
    return GB ? GB + 'GB' : MB ? MB + 'MB' : KB ? KB + 'KB' : bit + 'B';
}
exports.parseBit = parseBit;
/**
 * 解析掩码内容值
 * @param value 内容值字符串
 * @returns 掩码 ******2
 */
function parseSafeContent(value = '') {
    if (value.length < 3) {
        return '*'.repeat(value.length);
    }
    else if (value.length < 6) {
        return value[0] + '*'.repeat(value.length - 1);
    }
    else if (value.length < 10) {
        return value[0] + '*'.repeat(value.length - 2) + value[value.length - 1];
    }
    else if (value.length < 15) {
        return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
    }
    else {
        return value.slice(0, 3) + '*'.repeat(value.length - 6) + value.slice(-3);
    }
}
exports.parseSafeContent = parseSafeContent;
/**
 * 解析数据层级转树结构
 *
 * @param data 数组数据
 * @param fieldId 读取节点字段 默认 'id'
 * @param fieldParentId 读取节点父节点字段 默认 'parentId'
 * @param fieldChildren 设置子节点字段 默认 'children'
 * @returns 层级数组
 */
function parseDataToTree(data, fieldId = 'id', fieldParentId = 'parentId', fieldChildren = 'children') {
    // 节点分组
    const map = new Map();
    // 节点id
    const treeIds = [];
    // 树节点
    const tree = [];
    for (const item of data) {
        const parentId = item[fieldParentId];
        // 分组
        const mapItem = map.get(parentId) ?? [];
        mapItem.push(item);
        map.set(parentId, mapItem);
        // 记录节点id
        treeIds.push(item[fieldId]);
    }
    for (const [key, value] of map) {
        // 选择不是节点id的作为树节点
        if (!treeIds.includes(key)) {
            tree.push(...value);
        }
    }
    for (const iterator of tree) {
        componet(iterator);
    }
    /**闭包递归函数 */
    function componet(iterator) {
        const id = iterator[fieldId];
        const item = map.get(id);
        if (item) {
            iterator[fieldChildren] = item;
        }
        if (iterator[fieldChildren]) {
            for (const i of iterator[fieldChildren]) {
                componet(i);
            }
        }
    }
    return tree;
}
exports.parseDataToTree = parseDataToTree;
/**
 * 解析掩码手机号
 * @param mobile 11位手机号 字符串
 * @returns 掩码 136****2738
 */
function parseMaskMobile(mobile) {
    if (!mobile || mobile.length !== 11)
        return mobile;
    return mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
}
exports.parseMaskMobile = parseMaskMobile;
/**
 * 解析掩码邮箱号
 * @param email 邮箱号 字符串
 * @returns 掩码 123****@
 */
function parseMaskEmail(email) {
    if (!email || !email.includes('@'))
        return email;
    const strArr = email.split('@');
    const prefix = strArr[0];
    if (prefix.length < 3)
        return email;
    const mask = Array.from({ length: prefix.length - 3 }, () => '*').join('');
    return `${prefix.slice(0, 3)}${mask}@${strArr[1]}`;
}
exports.parseMaskEmail = parseMaskEmail;
/**
 * 解析字符串数组去重
 * @param arr 字符串数组
 * @returns 字符串数组
 */
function parseRemoveDuplicates(arr) {
    return [...new Set(arr)];
}
exports.parseRemoveDuplicates = parseRemoveDuplicates;
// RemoveDuplicatesToArray 数组内字符串分隔去重转为字符数组
/**
 * 解析字符串分隔去重转为字符数组
 * @param keyStr 字符串，逗号分隔符分隔的字符串
 * @param sep 分隔符，默认逗号
 * @returns 字符数组
 */
function parseRemoveDuplicatesToArray(keyStr, sep = ',') {
    let arr = [];
    if (keyStr === '') {
        return arr;
    }
    if (keyStr.includes(',')) {
        // 处理字符转数组后去重
        const strArr = keyStr.split(sep);
        arr = [...new Set(strArr)];
    }
    else {
        arr = [keyStr];
    }
    return arr;
}
exports.parseRemoveDuplicatesToArray = parseRemoveDuplicatesToArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZnJhbWV3b3JrL3V0aWxzL3BhcnNlL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFtRDtBQUVuRDs7O0dBR0c7QUFDSCxTQUFnQixXQUFXLENBQUMsS0FBVTtJQUNwQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUM1QyxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUM5QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0QjtJQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFYRCxrQ0FXQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLFlBQVksQ0FBQyxLQUFVO0lBQ3JDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzdCLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDakM7SUFDRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUM5QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDN0IsSUFBSSxLQUFLLEtBQUssT0FBTyxJQUFJLEtBQUssS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbkUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sT0FB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