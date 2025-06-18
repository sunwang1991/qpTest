import { login, logout, getInfo } from '@/api/auth';
import {
  delAccessToken,
  delRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/utils/auth';
import { isHttp } from '@/utils/validate';
import defaultAvatar from '@/assets/images/profile.png';

/**
 * 格式解析头像地址
 * @param avatar 头像路径
 * @returns url地址
 */
function parseAvatar(avatar) {
  if (!avatar) {
    return defaultAvatar;
  }
  if (isHttp(avatar)) {
    return avatar;
  }
  const baseApi = import.meta.env.VITE_APP_BASE_API;
  return `${baseApi}${avatar}`;
}

const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
  }),
  actions: {
    // 登录
    login(data) {
      return new Promise((resolve, reject) => {
        login(data)
          .then(res => {
            if (res.data) {
              setAccessToken(res.data.accessToken, res.data.expiresIn);
              setRefreshToken(res.data.refreshToken, res.data.refreshExpiresIn);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            if (res.data) {
              const { user, roles, permissions } = res.data;
              this.name = user.userName;
              this.avatar = parseAvatar(user.avatar);

              // 验证返回的roles是否是一个非空数组
              if (Array.isArray(roles) && roles.length > 0) {
                this.roles = roles;
                this.permissions = permissions;
              } else {
                this.roles = ['ROLE_DEFAULT'];
                this.permissions = [];
              }
              resolve(res);
              return;
            }
            // 网络错误时退出登录状态
            if (res.code === 500) {
              delAccessToken();
              delRefreshToken();
              window.location.reload();
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 退出系统
    logOut() {
      return new Promise(resolve => {
        logout(this.token).finally(() => {
          this.roles = [];
          this.permissions = [];
          delAccessToken();
          delRefreshToken();
          resolve();
        });
      });
    },
  },
});

export default useUserStore;
