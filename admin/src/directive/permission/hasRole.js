 /**
 * v-hasRole 角色权限处理
 * Copyright (c) 2019 ruoyi
 */
 
import useUserStore from '@/store/modules/user'
import { SYS_ROLE_SYSTEM_KEY } from '@/constants/admin-constants';

export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    const roles = useUserStore().roles

    if (value && value instanceof Array && value.length > 0) {
      const roleFlag = value

      const hasRole = roles.some(role => {
        return SYS_ROLE_SYSTEM_KEY === role || roleFlag.includes(role)
      })

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置角色权限标签值`)
    }
  }
}
