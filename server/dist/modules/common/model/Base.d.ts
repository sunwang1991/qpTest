import { EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
export declare class EverythingSubscriber implements EntitySubscriberInterface {
    /**
     * Called before entity insertion.
     */
    beforeInsert(event: InsertEvent<any>): void;
    /**
     * Called before entity insertion.
     */
    beforeUpdate(event: UpdateEvent<any>): void;
    /**
     * Called before entity insertion.
     */
    beforeRemove(event: RemoveEvent<any>): void;
    /**
     * Called after entity insertion.
     */
    afterInsert(event: InsertEvent<any>): void;
    /**
     * Called after entity insertion.
     */
    afterUpdate(event: UpdateEvent<any>): void;
    /**
     * Called after entity insertion.
     */
    afterRemove(event: RemoveEvent<any>): void;
    /**
     * Called after entity is loaded.
     */
    afterLoad(entity: any): void;
}
export declare class Base extends EverythingSubscriber {
    id: number;
    createTime: Date;
    updateTime: Date;
}
export declare class CommonBase extends Base {
    isDelete: boolean;
}
export declare class EnterpriseBase extends Base {
    enterpriseNo: string;
    updatedBy: string;
}
export declare class OpBase extends Base {
    updatedBy: string;
}
