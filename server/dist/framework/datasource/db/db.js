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
exports.DynamicDataSource = void 0;
const core_1 = require("@midwayjs/core");
const typeorm_1 = require("@midwayjs/typeorm");
const parse_1 = require("../../utils/parse/parse");
/**动态数据源 */
let DynamicDataSource = exports.DynamicDataSource = class DynamicDataSource {
    dataSourceManager;
    /**
     * 数据源
     * @param source 数据库连接
     * @return 连接实例
     */
    db(source) {
        if (!source) {
            source = 'default';
        }
        return this.dataSourceManager.getDataSource(source);
    }
    /**
     * 获取可用数据源名称
     * @return 数据源名称
     */
    names() {
        return this.dataSourceManager.getDataSourceNames();
    }
    /**
     * 原生语句查询和执行
     *
     * 使用后自动释放连接
     *
     * @param source 数据源 空字符默认'default'
     * @param sql sql预编译语句
     * @param parameters 预编译?参数
     * @returns 查询结果或异常错误
     */
    execute(source, sql, parameters) {
        const db = this.db(source);
        // 使用正则表达式替换连续的空白字符为单个空格
        sql = sql.replace(/\s+/g, ' ');
        // 查询结果
        return db.query(sql, parameters);
    }
    /**
     * 查询构造器
     *
     * 创建和控制单个数据库连接的状态, 允许控制事务但需要使用后手动释放连接
     *
     * @param source 数据源 空字符默认'default'
     * @returns 查询结果或异常错误
     */
    queryBuilder(source) {
        const db = this.db(source);
        return db.createQueryBuilder();
    }
    /**
     * 分页页码记录数
     * @param pageNum 页码
     * @param pageSize 单页记录数
     * @returns [起始页码,单页记录数]
     */
    pageNumSize(pageNum, pageSize) {
        // 记录起始索引
        let num = (0, parse_1.parseNumber)(pageNum);
        if (num < 1) {
            num = 1;
        }
        // 显示记录数
        let size = (0, parse_1.parseNumber)(pageSize);
        if (size < 0) {
            size = 10;
        }
        return [num - 1, size];
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", typeorm_1.TypeORMDataSourceManager)
], DynamicDataSource.prototype, "dataSourceManager", void 0);
exports.DynamicDataSource = DynamicDataSource = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], DynamicDataSource);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZnJhbWV3b3JrL2RhdGFzb3VyY2UvZGIvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBQzVELCtDQUE2RDtBQUc3RCxtREFBc0Q7QUFFdEQsV0FBVztBQUdKLElBQU0saUJBQWlCLCtCQUF2QixNQUFNLGlCQUFpQjtJQUVwQixpQkFBaUIsQ0FBMkI7SUFFcEQ7Ozs7T0FJRztJQUNJLEVBQUUsQ0FBQyxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLEdBQUcsU0FBUyxDQUFDO1NBQ3BCO1FBQ0QsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLO1FBQ1YsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksT0FBTyxDQUNaLE1BQWMsRUFDZCxHQUFXLEVBQ1gsVUFBa0I7UUFFbEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQix3QkFBd0I7UUFDeEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLE9BQU87UUFDUCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUksR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksWUFBWSxDQUFDLE1BQWM7UUFDaEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFdBQVcsQ0FDaEIsT0FBd0IsRUFDeEIsUUFBeUI7UUFFekIsU0FBUztRQUNULElBQUksR0FBRyxHQUFHLElBQUEsbUJBQVcsRUFBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7WUFDWCxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQ1Q7UUFFRCxRQUFRO1FBQ1IsSUFBSSxJQUFJLEdBQUcsSUFBQSxtQkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNaLElBQUksR0FBRyxFQUFFLENBQUM7U0FDWDtRQUNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7Q0FDRixDQUFBO0FBaEZTO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ2tCLGtDQUF3Qjs0REFBQzs0QkFGekMsaUJBQWlCO0lBRjdCLElBQUEsY0FBTyxHQUFFO0lBQ1QsSUFBQSxnQkFBUyxHQUFFO0dBQ0MsaUJBQWlCLENBa0Y3QiJ9