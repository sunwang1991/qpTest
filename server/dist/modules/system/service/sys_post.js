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
exports.SysPostService = void 0;
const core_1 = require("@midwayjs/core");
const file_1 = require("../../../framework/utils/file/file");
const sys_user_post_1 = require("../repository/sys_user_post");
const sys_post_1 = require("../repository/sys_post");
const sys_post_2 = require("../model/sys_post");
/**岗位表 服务层处理 */
let SysPostService = exports.SysPostService = class SysPostService {
    /**岗位服务 */
    sysPostRepository;
    /**用户与岗位关联服务 */
    sysUserPostRepository;
    /**文件服务 */
    fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns [rows, total]
     */
    async findByPage(query) {
        return await this.sysPostRepository.selectByPage(query);
    }
    /**
     * 查询数据
     * @param sysPost 信息
     * @returns []
     */
    async find(sysPost) {
        return await this.sysPostRepository.select(sysPost);
    }
    /**
     * 根据ID查询信息
     * @param postId ID
     * @returns 结果
     */
    async findById(postId) {
        if (postId <= 0) {
            return new sys_post_2.SysPost();
        }
        const posts = await this.sysPostRepository.selectByIds([postId]);
        if (posts.length > 0) {
            return posts[0];
        }
        return new sys_post_2.SysPost();
    }
    /**
     * 新增信息
     * @param sysPost 信息
     * @returns ID
     */
    async insert(sysPost) {
        return await this.sysPostRepository.insert(sysPost);
    }
    /**
     * 修改信息
     * @param sysPost 信息
     * @returns 影响记录数
     */
    async update(sysPost) {
        return await this.sysPostRepository.update(sysPost);
    }
    /**
     * 批量删除信息
     * @param postIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    async deleteByIds(postIds) {
        // 检查是否存在
        const posts = await this.sysPostRepository.selectByIds(postIds);
        if (posts.length < 0) {
            return [0, '没有权限访问岗位数据！'];
        }
        for (const post of posts) {
            const useCount = await this.sysUserPostRepository.existUserByPostId(post.postId);
            if (useCount > 0) {
                return [0, `【${post.postName}】已分配给用户,不能删除`];
            }
        }
        if (posts.length === postIds.length) {
            const rows = await this.sysPostRepository.deleteByIds(postIds);
            return [rows, ''];
        }
        return [0, '删除岗位信息失败！'];
    }
    /**
     * 检查岗位名称是否唯一
     * @param postName 岗位名称
     * @param postId 岗位ID
     * @returns 数量
     */
    async checkUniqueByName(postName, postId) {
        const sysPost = new sys_post_2.SysPost();
        sysPost.postName = postName;
        const uniqueId = await this.sysPostRepository.checkUnique(sysPost);
        if (uniqueId === postId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 检查岗位编码是否唯一
     * @param postCode 岗位名称
     * @param postId 岗位ID
     * @returns 数量
     */
    async checkUniqueByCode(postCode, postId) {
        const sysPost = new sys_post_2.SysPost();
        sysPost.postCode = postCode;
        const uniqueId = await this.sysPostRepository.checkUnique(sysPost);
        if (uniqueId === postId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 根据用户ID获取岗位选择框列表
     * @param userId 用户ID
     * @returns 数量
     */
    async findByUserId(userId) {
        return await this.sysPostRepository.selectByUserId(userId);
    }
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    async exportData(rows, fileName) {
        // 导出数据组装
        const arr = [];
        for (const row of rows) {
            // 状态
            let statusValue = '停用';
            if (row.statusFlag === '1') {
                statusValue = '正常';
            }
            const data = {
                岗位编号: row.postId,
                岗位编码: row.postCode,
                岗位名称: row.postName,
                岗位排序: row.postSort,
                岗位状态: statusValue,
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_post_1.SysPostRepository)
], SysPostService.prototype, "sysPostRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_post_1.SysUserPostRepository)
], SysPostService.prototype, "sysUserPostRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysPostService.prototype, "fileUtil", void 0);
exports.SysPostService = SysPostService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysPostService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3Bvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vc2VydmljZS9zeXNfcG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFFNUQsNkRBQThEO0FBQzlELCtEQUFvRTtBQUNwRSxxREFBMkQ7QUFDM0QsZ0RBQTRDO0FBRTVDLGVBQWU7QUFHUixJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUN6QixVQUFVO0lBRUYsaUJBQWlCLENBQW9CO0lBRTdDLGVBQWU7SUFFUCxxQkFBcUIsQ0FBd0I7SUFFckQsVUFBVTtJQUVGLFFBQVEsQ0FBVztJQUUzQjs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FDckIsS0FBNkI7UUFFN0IsT0FBTyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQWdCO1FBQ2hDLE9BQU8sTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFjO1FBQ2xDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNmLE9BQU8sSUFBSSxrQkFBTyxFQUFFLENBQUM7U0FDdEI7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakI7UUFDRCxPQUFPLElBQUksa0JBQU8sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFF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