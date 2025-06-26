import { CommonBase } from '../../common/model/Base';
/**交易记录表 */
export declare class TransactionModel extends CommonBase {
    /**房间ID */
    roomId: number;
    /**支付用户ID */
    userId: number;
    /**收款对象ID */
    receiveUserId: number;
    /** 金额 */
    payMoney: number;
}
