import { Rule, RuleType } from '@midwayjs/validate';
import { Column, Entity } from 'typeorm';
import { CommonBase } from '../../common/model/Base';

/**房间 */
@Entity('room')
export class RoomModel extends CommonBase {
  /**创建者 */
  @Rule(RuleType.string().allow(''))
  @Column({ name: 'creator_id' })
  creatorId: number;

  /**房间名称 */
  @Rule(RuleType.string().allow(''))
  @Column({ name: 'room_name' })
  roomName: string;

  /**房间状态（0停用 1正常 2已结算） */
  @Rule(RuleType.string().pattern(/^[012]$/))
  @Column({ name: 'status_flag' })
  statusFlag: string;

  /** 备注 */
  @Rule(RuleType.string().allow(''))
  @Column({ name: 'remark' })
  remark: string;
}
