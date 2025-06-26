import { CommonBase } from '../../common/model/Base';
/**房间 */
export declare class RoomModel extends CommonBase {
    /**创建者 */
    creatorId: number;
    /**房间名称 */
    roomName: string;
    /**房间状态（0停用 1正常 2已结算） */
    statusFlag: string;
    /** 备注 */
    remark: string;
}
