import { Resp } from '../../../framework/resp/api';
/**通用请求 控制层处理 */
export declare class CommonController {
    /**哈希编码 */
    hash(type: 'sha1' | 'sha256' | 'sha512' | 'md5', str: string): Promise<Resp>;
}
