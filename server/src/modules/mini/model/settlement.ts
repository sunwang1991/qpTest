import { Rule, RuleType } from '@midwayjs/validate';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CommonBase } from '../../common/model/Base';

/**结算记录表 */
@Entity('settlement')
export class SettlementModel extends CommonBase {
  /**房间ID */
  @Rule(RuleType.number().allow(0))
  @PrimaryColumn({ name: 'room_id' })
  roomId: number;

  /**用户ID */
  @Rule(RuleType.number().allow(0))
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  /** 金额 */
  @Rule(RuleType.number().allow(0))
  @Column({ name: 'money' })
  money: number;
}
