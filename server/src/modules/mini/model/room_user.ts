import { Rule, RuleType } from '@midwayjs/validate';
import { Entity, PrimaryColumn } from 'typeorm';

/**房间和用户关联表 */
@Entity('room_user')
export class RoomUserModel {
  /**房间ID */
  @Rule(RuleType.number())
  @PrimaryColumn({ name: 'room_id' })
  roomId: number;

  /**用户ID */
  @Rule(RuleType.number().allow(0))
  @PrimaryColumn({ name: 'user_id' })
  userId: number;
}
