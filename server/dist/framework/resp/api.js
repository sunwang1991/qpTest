"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resp = void 0;
class Resp {
    code;
    msg;
    // 响应-code错误失败
    static CODE_ERROR = 400001;
    // 响应-msg错误失败
    static MSG_ERROR = 'error';
    // 响应-msg正常成功
    static CODE_SUCCESS = 200001;
    // 响应-code正常成功
    static MSG_SUCCESS = 'success';
    /**
     * 响应结果
     * @param code 响应状态码
     * @param msg 响应信息
     * @returns 响应结果对象
     */
    static codeMsg(code, msg) {
        // 返回一个包含code和msg的对象
        return { code: code, msg: msg };
    }
    /**
     * 响应成功结果
     * @param args 额外参数 {value:1}
     * @return 响应结果对象
     */
    static ok(args) {
        return { code: this.CODE_SUCCESS, msg: this.MSG_SUCCESS, ...args };
    }
    /**
     * 成功结果信息
     * @param msg 响应信息
     * @return 响应结果对象
     */
    static okMsg(msg) {
        return { code: this.CODE_SUCCESS, msg };
    }
    /**
     * 成功结果数据
     * @param data 数据值
     * @return 响应结果对象
     */
    static okData(data) {
        return { code: this.CODE_SUCCESS, msg: this.MSG_SUCCESS, data };
    }
    /**
     * 失败结果
     * @param args 额外参数 {value:1}
     * @return 响应结果对象
     */
    static err(args) {
        return { code: this.CODE_ERROR, msg: this.MSG_ERROR, ...args };
    }
    /**
     * 失败结果信息
     * @param msg 响应信息
     * @return 响应结果对象
     */
    static errMsg(msg) {
        return { code: this.CODE_ERROR, msg };
    }
    /**
     * 失败结果数据
     * @param data 数据值
     * @return 响应结果对象
     */
    static errData(data) {
        return { code: this.CODE_ERROR, msg: this.MSG_ERROR, data };
    }
}
exports.Resp = Resp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay9yZXNwL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLElBQUk7SUFDZixJQUFJLENBQVM7SUFDYixHQUFHLENBQVM7SUFHWixjQUFjO0lBQ2QsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7SUFDM0IsYUFBYTtJQUNiLE1BQU0sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQzNCLGFBQWE7SUFDYixNQUFNLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztJQUM3QixjQUFjO0lBQ2QsTUFBTSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7SUFFL0I7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQVksRUFBRSxHQUFXO1FBQ3RDLG9CQUFvQjtRQUNwQixPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLElBQTBCO1FBQ2xDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO0lBQ3JFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFXO1FBQ3RCLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUksSUFBTztRQUN0QixPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDbEUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQTBCO1FBQ25DLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFXO1FBQ3ZCLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUksSUFBTztRQUN2QixPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDOUQsQ0FBQzs7QUE3RUgsb0JBOEVDIn0=