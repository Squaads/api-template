import BaseModel from './base.model';

export default class BaseManager<T = {}> {
    baseModel: BaseModel<any, any>;

    constructor(baseModel: BaseModel<any, any>) {
        this.baseModel = baseModel;
    }

    public getAll(
        filters: Record<string, unknown> = {},
        projection: string = '',
        options: Record<string, unknown> = {},
        populateFields?: string[] | Record<string, string>[]
    ): Promise<T[]> {
        return this.baseModel.getAll(filters, projection, options);
    }

    public getById(id: string, populateFields?: string[] | Record<string, string>[]): Promise<T> {
        return this.baseModel.getById(id);
    }

    public create(newEntity: T): Promise<T> {
        return this.baseModel.create(newEntity);
    }
    public createMany(newEntity: T[]): Promise<void> {
        return this.baseModel.create(newEntity);
    }

    public delete(id: string): Promise<T> {
        return this.baseModel.delete(id);
    }

    public update(id: string, newEntity: Record<keyof T, unknown>): Promise<T> {
        return this.baseModel.update(id, newEntity);
    }

    public set(id: string, newEntity: T): Promise<T> {
        return this.baseModel.set(id, newEntity);
    }
}
