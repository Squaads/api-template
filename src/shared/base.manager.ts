import { Document, Schema } from 'mongoose';
import { QueryPopulateOptions } from "mongoose";
import BaseModel from "./base.model";
import'./services/schemas-initializer';

export default class BaseManager<S, T> {

    baseModel: BaseModel<S, T>;

    constructor(baseModel: BaseModel<S, T>) {
        this.baseModel = baseModel;
    }
    
    public getAll(filters: Object, projection?: Object, options?: Object, populateFields?: string[] | QueryPopulateOptions[]): Promise<T[]> {
        return (populateFields && populateFields.length != 0)
            ? this.baseModel.getAllPopulated(filters, projection, options, populateFields)
            : this.baseModel.getAll(filters, projection, options);

    }

    public getById(id: string, populateFields?: string[] | QueryPopulateOptions[]): Promise<T> {
        return (populateFields)
            ? this.baseModel.getPopulatedById(id, populateFields)
            : this.baseModel.getById(id);
    }

    public create(newEntity: S): Promise<T> {
        return this.baseModel.create(newEntity);
    }

    public delete(id: string): Promise<T> {
        return this.baseModel.delete(id);
    }

    public update(id: string, newEntity: S): Promise<T> {
        return this.baseModel.update(id, newEntity);
    }

    public set(id: string, newEntity: S): Promise<T> {
        return this.baseModel.set(id, newEntity);
    }
}