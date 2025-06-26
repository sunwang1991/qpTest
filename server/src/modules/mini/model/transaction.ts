import { Rule, RuleType } from '@midwayjs/validate';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CommonBase } from '../../common/model/Base';

/**交易记录表 */
@Entity('transaction')
export class TransactionModel extends CommonBase {
  /**房间ID */
  @Rule(RuleType.number().allow(0))
  @PrimaryColumn({ name: 'room_id' })
  roomId: number;

  /**支付用户ID */
  @Rule(RuleType.number().allow(0))
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  /**收款对象ID */
  @Rule(RuleType.number().allow(0))
  @PrimaryColumn({ name: 'receive_user_id' })
  receiveUserId: number;

  /** 金额 */
  @Rule(RuleType.number().allow(0))
  @Column({ name: 'pay_money' })
  payMoney: number;
}
