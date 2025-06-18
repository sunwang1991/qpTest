export declare class Resp {
    code: number;
    msg: string;
    [key: string]: any;
    static CODE_ERROR: number;
    static MSG_ERROR: string;
    static CODE_SUCCESS: number;
    static MSG_SUCCESS: string;
    /**
     * 响应结果
     * @param code 响应状态码
     * @param msg 响应信息
     * @returns 响应结果对象
     */
    static codeMsg(code: number, msg: string): {
        code: number;
        msg: string;
    };
    /**
     * 响应成功结果
     * @param args 额外参数 {value:1}
     * @return 响应结果对象
     */
    static ok(args?: Record<string, any>): {
        code: number;
        msg: string;
    };
    /**
     * 成功结果信息
     * @param msg 响应信息
     * @return 响应结果对象
     */
    static okMsg(msg: string): {
        code: number;
        msg: string;
    };
    /**
     * 成功结果数据
     * @param data 数据值
     * @return 响应结果对象
     */
    static okData<T>(data: T): {
        code: number;
        msg: string;
        data: T;
    };
    /**
     * 失败结果
     * @param args 额外参数 {value:1}
     * @return 响应结果对象
     */
    static err(args?: Record<string, any>): {
        code: number;
        msg: string;
    };
    /**
     * 失败结果信息
     * @param msg 响应信息
     * @return 响应结果对象
     */
    static errMsg(msg: string): {
        code: number;
        msg: string;
    };
    /**
     * 失败结果数据
     * @param data 数据值
     * @return 响应结果对象
     */
    static errData<T>(data: T): {
        code: number;
        msg: string;
        data: T;
    };
}
