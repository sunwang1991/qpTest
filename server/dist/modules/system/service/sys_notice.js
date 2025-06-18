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
exports.SysNoticeService = void 0;
const core_1 = require("@midwayjs/core");
const sys_notice_1 = require("../model/sys_notice");
const sys_notice_2 = require("../repository/sys_notice");
/**公告 服务层处理 */
let SysNoticeService = exports.SysNoticeService = class SysNoticeService {
    /**公告服务 */
    sysNoticeRepository;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns [rows, total]
     */
    async findByPage(query) {
        return await this.sysNoticeRepository.selectByPage(query);
    }
    /**
     * 根据ID查询信息
     * @param noticeId ID
     * @returns 结果
     */
    async findById(noticeId) {
        if (noticeId <= 0) {
            return new sys_notice_1.SysNotice();
        }
        const configs = await this.sysNoticeRepository.selectByIds([noticeId]);
        if (configs.length > 0) {
            return configs[0];
        }
        return new sys_notice_1.SysNotice();
    }
    /**
     * 新增信息
     * @param sysNotice 信息
     * @returns ID
     */
    async insert(sysNotice) {
        return await this.sysNoticeRepository.insert(sysNotice);
    }
    /**
     * 修改信息
     * @param sysNotice 信息
     * @returns 影响记录数
     */
    async update(sysNotice) {
        return await this.sysNoticeRepository.update(sysNotice);
    }
    /**
     * 批量删除信息
     * @param noticeIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    async deleteByIds(noticeIds) {
        // 检查是否存在
        const notices = await this.sysNoticeRepository.selectByIds(noticeIds);
        if (notices.length <= 0) {
            return [0, '没有权限访问公告信息数据！'];
        }
        for (const notice of notices) {
            // 检查是否为已删除
            if (notice.delFlag === '1') {
                return [0, `ID:${notice.noticeId} 公告信息已经删除！`];
            }
        }
        if (notices.length === noticeIds.length) {
            const rows = await this.sysNoticeRepository.deleteByIds(noticeIds);
            return [rows, ''];
        }
        return [0, '删除公告信息失败！'];
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_notice_2.SysNoticeRepository)
], SysNoticeService.prototype, "sysNoticeRepository", void 0);
exports.SysNoticeService = SysNoticeService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysNoticeService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX25vdGljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9zZXJ2aWNlL3N5c19ub3RpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRTVELG9EQUFnRDtBQUNoRCx5REFBK0Q7QUFFL0QsY0FBYztBQUdQLElBQU0sZ0JBQWdCLDhCQUF0QixNQUFNLGdCQUFnQjtJQUMzQixVQUFVO0lBRUYsbUJBQW1CLENBQXNCO0lBRWpEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUNyQixLQUE2QjtRQUU3QixPQUFPLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBZ0I7UUFDcEMsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxzQkFBUyxFQUFFLENBQUM7U0FDeEI7UUFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7UUFDRCxPQUFPLElBQUksc0JBQVMsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFvQjtRQUN0QyxPQUFPLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBb0I7UUFDdEMsT0FBTyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQW1CO1FBQzFDLFNBQVM7UUFDVCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUN2QixPQUFPLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDNUIsV0FBVztZQUNYLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxHQUFHLEVBQUU7Z0JBQzFCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsTUFBTSxNQUFNLENBQUMsUUFBUSxZQUFZLENBQUMsQ0FBQzthQUMvQztTQUNGO1FBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25FLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbkI7UUFDRCxPQUFPLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7Q0FDRixDQUFBO0FBdEVTO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ29CLGdDQUFtQjs2REFBQzsyQkFIdEMsZ0JBQWdCO0lBRjVCLElBQUEsY0FBTyxHQUFFO0lBQ1QsSUFBQSxnQkFBUyxHQUFFO0dBQ0MsZ0JBQWdCLENBeUU1QiJ9