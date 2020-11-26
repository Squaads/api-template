import { QueryPopulateOptions, Schema } from "mongoose";

import MongooseRepo from "./repositories/mongoose.repository";


export default class BaseModel<S,T> {
    //private schema: Schema;
    //private collection: string
    protected db: MongooseRepo;

    constructor(collection: string, schema: Schema) {
        //this.collection = collection;
        //this.schema = schema;
        this.db = new MongooseRepo(collection, schema);
    }

    create(entity: S): Promise<T> {
        return this.db.create(entity);
    }

    getById(id: string): Promise<T> {
        return this.db.getById(id);
    }

    getPopulatedById(id: string, populateFields: string[] | QueryPopulateOptions[]): Promise<T> {
        return this.db.getById(id, populateFields);
    }

    getAll(filters: Object, projection?: Object, options?: Object): Promise<T[]> {
        return this.db.get(filters, projection, options);
    }

    getAllPopulated(filters: Object, projection?: Object, options?: Object, populateFields?: string[] | QueryPopulateOptions[]): Promise<T[]> {
        return this.db.get(filters, projection, options, populateFields);
    }

    update(id: string, newEntity: S): Promise<T> {
        return this.db.update(id, newEntity);
    }

    set(id: string, newEntity: S): Promise<T> {
        return this.db.set(id, newEntity);
    }

    delete(id: string): Promise<T> {
        return this.db.delete(id);
    }
}
