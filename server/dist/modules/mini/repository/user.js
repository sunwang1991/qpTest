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
        // 插入数据
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvcmVwb3NpdG9yeS91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0RDtBQUM1RCw0REFBd0U7QUFDeEUsd0NBQTBDO0FBRTFDLGVBQWU7QUFHUixJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUVqQixFQUFFLENBQW9CO0lBQzlCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFjO1FBQ3hDLElBQUksTUFBTSxLQUFLLEVBQUUsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUU7YUFDM0IsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDO2FBQ2QsSUFBSSxDQUFDLGdCQUFTLEVBQUUsTUFBTSxDQUFDO2FBQ3ZCLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUNsRCxNQUFNLEVBQUUsQ0FBQztRQUNaLElBQUksUUFBUTtZQUFFLE9BQU8sUUFBUSxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRO1FBQ2xDLE9BQU87UUFDUCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFO2FBQ3pCLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxFQUFFO2FBQ1IsSUFBSSxDQUFDLGdCQUFTLENBQUM7YUFDZixNQUFNLENBQUMsUUFBUSxDQUFDO2FBQ2hCLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQWM7UUFDN0IsSUFBSSxNQUFNLEtBQUssRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQy9CLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFO2FBQzNCLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUNkLElBQUksQ0FBQyxnQkFBUyxFQUFFLE1BQU0sQ0FBQzthQUN2QixLQUFLLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7YUFDOUMsTUFBTSxFQUFFLENBQUM7UUFDWixJQUFJLFFBQVE7WUFBRSxPQUFPLFFBQVEsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVE7UUFDM0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRTthQUN6QixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxnQkFBUyxDQUFDO2FBQ2pCLEdBQUcsQ0FBQyxRQUFRLENBQUM7YUFDYixLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQzthQUN0QyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNwQixDQUFDO0NBQ0YsQ0FBQTtBQXpFUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNHLHNCQUFpQjswQ0FBQzt5QkFGbkIsY0FBYztJQUYxQixJQUFBLGNBQU8sR0FBRTtJQUNULElBQUEsZ0JBQVMsR0FBRTtHQUNDLGNBQWMsQ0EyRTFCIn0=