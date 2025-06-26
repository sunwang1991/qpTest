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
exports.OpBase = exports.EnterpriseBase = exports.CommonBase = exports.Base = exports.EverythingSubscriber = void 0;
const typeorm_1 = require("typeorm");
class EverythingSubscriber {
    /**
     * Called before entity insertion.
     */
    beforeInsert(event) {
        console.log('BEFORE ENTITY INSERTED:', event.entity);
    }
    /**
     * Called before entity insertion.
     */
    beforeUpdate(event) {
        console.log('BEFORE ENTITY UPDATED:', event.entity);
    }
    /**
     * Called before entity insertion.
     */
    beforeRemove(event) {
        console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
    }
    /**
     * Called after entity insertion.
     */
    afterInsert(event) {
        console.log('AFTER ENTITY INSERTED:', event.entity);
    }
    /**
     * Called after entity insertion.
     */
    afterUpdate(event) {
        console.log('AFTER ENTITY UPDATED:', event.entity);
    }
    /**
     * Called after entity insertion.
     */
    afterRemove(event) {
        console.log(`AFTER ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
    }
    /**
     * Called after entity is loaded.
     */
    afterLoad(entity) {
        console.log('AFTER ENTITY LOADED:', entity);
    }
}
exports.EverythingSubscriber = EverythingSubscriber;
class Base extends EverythingSubscriber {
    id;
    createTime;
    updateTime;
}
exports.Base = Base;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Base.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Base.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Base.prototype, "updateTime", void 0);
class CommonBase extends Base {
    isDelete;
}
exports.CommonBase = CommonBase;
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, comment: '软删除' }),
    __metadata("design:type", Boolean)
], CommonBase.prototype, "isDelete", void 0);
class EnterpriseBase extends Base {
    enterpriseNo;
    updatedBy;
}
exports.EnterpriseBase = EnterpriseBase;
__decorate([
    (0, typeorm_1.Column)({
        name: 'enterprise_no',
        type: 'varchar',
        length: 13,
        comment: '企业编号',
    }),
    __metadata("design:type", String)
], EnterpriseBase.prototype, "enterpriseNo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'updated_by',
        type: 'varchar',
        length: 13,
        comment: '操作用户编号',
    }),
    __metadata("design:type", String)
], EnterpriseBase.prototype, "updatedBy", void 0);
class OpBase extends Base {
    updatedBy;
}
exports.OpBase = OpBase;
__decorate([
    (0, typeorm_1.Column)({
        name: 'updated_by',
        type: 'varchar',
        length: 13,
        comment: '操作用户编号',
    }),
    __metadata("design:type", String)
], OpBase.prototype, "updatedBy", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbW1vbi9tb2RlbC9CYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQVNpQjtBQUVqQixNQUFhLG9CQUFvQjtJQUMvQjs7T0FFRztJQUNILFlBQVksQ0FBQyxLQUF1QjtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxZQUFZLENBQUMsS0FBdUI7UUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsWUFBWSxDQUFDLEtBQXVCO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQ1QseUJBQXlCLEtBQUssQ0FBQyxRQUFRLFlBQVksRUFDbkQsS0FBSyxDQUFDLE1BQU0sQ0FDYixDQUFDO0lBQ0osQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVyxDQUFDLEtBQXVCO1FBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVcsQ0FBQyxLQUF1QjtRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXLENBQUMsS0FBdUI7UUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FDVCx3QkFBd0IsS0FBSyxDQUFDLFFBQVEsWUFBWSxFQUNsRCxLQUFLLENBQUMsTUFBTSxDQUNiLENBQUM7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLENBQUMsTUFBVztRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRjtBQXZERCxvREF1REM7QUFFRCxNQUFhLElBQUssU0FBUSxvQkFBb0I7SUFFNUMsRUFBRSxDQUFTO0lBR1gsVUFBVSxDQUFPO0lBR2pCLFVBQVUsQ0FBTztDQUNsQjtBQVRELG9CQVNDO0FBUEM7SUFEQyxJQUFBLGdDQUFzQixHQUFFOztnQ0FDZDtBQUdYO0lBREMsSUFBQSwwQkFBZ0IsR0FBRTs4QkFDUCxJQUFJO3dDQUFDO0FBR2pCO0lBREMsSUFBQSwwQkFBZ0IsR0FBRTs4QkFDUCxJQUFJO3dDQUFDO0FBR25CLE1BQWEsVUFBVyxTQUFRLElBQUk7SUFFbEMsUUFBUSxDQUFVO0NBQ25CO0FBSEQsZ0NBR0M7QUFEQztJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7OzRDQUMxQztBQUdwQixNQUFhLGNBQWUsU0FBUSxJQUFJO0lBT3RDLFlBQVksQ0FBUztJQVFyQixTQUFTLENBQVM7Q0FDbkI7QUFoQkQsd0NBZ0JDO0FBVEM7SUFOQyxJQUFBLGdCQUFNLEVBQUM7UUFDTixJQUFJLEVBQUUsZUFBZTtRQUNyQixJQUFJLEVBQUUsU0FBUztRQUNmLE1BQU0sRUFBRSxFQUFFO1FBQ1YsT0FBTyxFQUFFLE1BQU07S0FDaEIsQ0FBQzs7b0RBQ21CO0FBUXJCO0lBTkMsSUFBQSxnQkFBTSxFQUFDO1FBQ04sSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFLFNBQVM7UUFDZixNQUFNLEVBQUUsRUFBRTtRQUNWLE9BQU8sRUFBRSxRQUFRO0tBQ2xCLENBQUM7O2lEQUNnQjtBQUdwQixNQUFhLE1BQU8sU0FBUSxJQUFJO0lBTzlCLFNBQVMsQ0FBUztDQUNuQjtBQVJELHdCQVFDO0FBREM7SUFOQyxJQUFBLGdCQUFNLEVBQUM7UUFDTixJQUFJLEVBQUUsWUFBWTtRQUNsQixJQUFJLEVBQUUsU0FBUztRQUNmLE1BQU0sRUFBRSxFQUFFO1FBQ1YsT0FBTyxFQUFFLFFBQVE7S0FDbEIsQ0FBQzs7eUNBQ2dCIn0=