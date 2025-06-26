import { Rule, RuleType } from '@midwayjs/validate';
import { Column, Entity } from 'typeorm';
import { CommonBase } from '../../common/model/Base';

/**用户信息表 */
@Entity('user')
export class UserModel extends CommonBase {
  /**微信openId */
  @Rule(RuleType.string().required())
  @Column({ name: 'open_id' })
  openId: string;

  /**手机号码 */
  @Rule(RuleType.string().allow(''))
  @Column({ name: 'phone', nullable: true, default: '' })
  phone: string;

  /**用户昵称 */
  @Rule(RuleType.string().allow(''))
  @Column({ name: 'nick_name', nullable: true, default: '' })
  nickName: string;

  /**用户性别（0未知 1男 2女） */
  @Rule(RuleType.string().pattern(/^[012]$/))
  @Column({ name: 'sex', default: '0' })
  sex: string;

  /**头像地址 */
  @Rule(RuleType.string().allow(''))
  @Column({ name: 'avatar', nullable: true, default: '' })
  avatar: string;

  /**帐号状态（0停用 1正常） */
  @Rule(RuleType.string().pattern(/^[01]$/))
  @Column({ name: 'status_flag', default: '1' })
  statusFlag: string;

  /**最后登录IP */
  @Rule(RuleType.string().allow(''))
  @Column({ name: 'login_ip', nullable: true, default: '' })
  loginIp: string;

  /**最后登录时间 */
  @Rule(RuleType.number().allow(0))
  @Column({ name: 'login_time', nullable: true, default: 0 })
  loginTime: number;

  /**备注 */
  @Rule(RuleType.string().allow(''))
  @Column({
    length: 200,
    name: 'remark',
    nullable: true,
    default: '',
  })
  remark: string;
}
