"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const user_1 = require("../model/user");
/**用户表 数据层处理 */
let UserRepository = exports.UserRepository = class UserRepository {
    db;
    /**
     * 通过openId查询
     *
     * @param openId
     * @return 信息
     */
    async selectByOpenId(openId) {
        if (openId === '') {
            return null;
        }
        // 查询数据
        const userInfo = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('user')
            .from(user_1.UserModel, 'user')
            .where('user.openId = :openId', { openId: openId })
            .getOne();
        if (userInfo)
            return userInfo;
        return null;
    }
    /**
     * 插入数据
     *
     * @param userInfo
     * @return 信息
     */
    async insertUserInfo(userInfo) {
        //设定随机图片
        let avatarList = [
            'https://www.sunwang.top/upload/avatar/2025/08/3WE0ZnFe1SQ46d62ad7388264705f044975f1f83ade1_e2qund.jpg',
            'https://www.sunwang.top/upload/avatar/2025/08/1MsWuju8dc2v4795f58d334ef25d3c583f3ffd7fa253_kwzpl1.jpg',
            'https://www.sunwang.top/upload/avatar/2025/08/3r0rq07bN4Rs7099b29b5e667467dc06e6ad186c4264_htvkkm.jpeg',
            'https://www.sunwang.top/upload/avatar/2025/08/AtJ2LJRuwn618084a90ef3dcdb62b00b3d7df8957d52_lpxv6s.jpg',
            'https://www.sunwang.top/upload/avatar/2025/08/UU5wNwK4xpE8f558ca3365ee63d8051ba0036e01dc11_cea4po.jpg',
            'https://www.sunwang.top/upload/avatar/2025/08/CV0xBQsivG6317eca60357136c10ddd4f05f1bf31b97_b1dwy6.jpg',
            'https://www.sunwang.top/upload/avatar/2025/08/DWRZDlkpFRVf57f535346bbb285b2184f45bb8f050f1_s8u38r.jpg',
            'https://www.sunwang.top/upload/avatar/2025/08/jLCicKUnRkTqcd3b0ab986e74146f2ea8074de731824_3ewp8w.jpg',
            'https://www.sunwang.top/upload/avatar/2025/08/QFQflGwgka7P230db2d969061357a0384d64a20a5535_rbd1b4.jpg',
        ];
        // 插入数据
        userInfo = {
            ...userInfo,
            nickName: '匿名用户',
            avatar: avatarList[Math.floor(Math.random() * avatarList.length)],
        };
        const result = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .insert()
            .into(user_1.UserModel)
            .values(userInfo)
            .execute();
        return result.raw;
    }
    /**
     * 通过userId查询用户信息
     * @param id
     */
    async selectById(userId) {
        if (userId === '')
            return null;
        // 查询数据
        const userInfo = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('user')
            .from(user_1.UserModel, 'user')
            .where('user.id = :userId', { userId: userId })
            .getOne();
        if (userInfo)
            return userInfo;
        return null;
    }
    /**
     * 更新用户信息
     * @param userInfo
     */
    async updateUserInfo(userInfo) {
        const result = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(user_1.UserModel)
            .set(userInfo)
            .where('id = :id', { id: userInfo.id })
            .execute();
        return result.raw;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], UserRepository.prototype, "db", void 0);
exports.UserRepository = UserRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], UserRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvcmVwb3NpdG9yeS91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0RDtBQUM1RCw0REFBd0U7QUFDeEUsd0NBQTBDO0FBRTFDLGVBQWU7QUFHUixJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUVqQixFQUFFLENBQW9CO0lBQzlCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFjO1FBQ3hDLElBQUksTUFBTSxLQUFLLEVBQUUsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUU7YUFDM0IsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ2QsSUFBSSxDQUFDLGdCQUFTLEVBQUUsTUFBTSxDQUFDO2FBQ3ZCLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUNsRCxNQUFNLEVBQUUsQ0FBQztRQUNaLElBQUksUUFBUTtZQUFFLE9BQU8sUUFBUSxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRO1FBQ2xDLFFBQVE7UUFDUixJQUFJLFVBQVUsR0FBRztZQUNmLHVHQUF1RztZQUN2Ryx1R0FBdUc7WUFDdkcsd0dBQXdHO1lBQ3hHLHVHQUF1RztZQUN2Ryx1R0FBdUc7WUFDdkcsdUdBQXVHO1lBQ3ZHLHVHQUF1RztZQUN2Ryx1R0FBdUc7WUFDdkcsdUdBQXVHO1NBQ3hHLENBQUM7UUFDRixPQUFPO1FBQ1AsUUFBUSxHQUFHO1lBQ1QsR0FBRyxRQUFRO1lBQ1gsUUFBUSxFQUFFLE1BQU07WUFDaEIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEUsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUU7YUFDekIsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLEVBQUU7YUFDUixJQUFJLENBQUMsZ0JBQVMsQ0FBQzthQUNmLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDaEIsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBYztRQUM3QixJQUFJLE1BQU0sS0FBSyxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDL0IsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUU7YUFDM0IsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ2QsSUFBSSxDQUFDLGdCQUFTLEVBQUUsTUFBTSxDQUFDO2FBQ3ZCLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUM5QyxNQUFNLEVBQUUsQ0FBQztRQUNaLElBQUksUUFBUTtZQUFFLE9BQU8sUUFBUSxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUTtRQUMzQixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFO2FBQ3pCLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLGdCQUFTLENBQUM7YUFDakIsR0FBRyxDQUFDLFFBQVEsQ0FBQzthQUNiLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ3RDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ3BCLENBQUM7Q0FDRixDQUFBO0FBMUZTO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ0csc0JBQWlCOzBDQUFDO3lCQUZuQixjQUFjO0lBRjFCLElBQUEsY0FBTyxHQUFFO0lBQ1QsSUFBQSxnQkFBUyxHQUFFO0dBQ0MsY0FBYyxDQTRGMUIifQ==