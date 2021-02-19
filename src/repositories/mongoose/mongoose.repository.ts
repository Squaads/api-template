import { Document, NativeError, Query, QueryPopulateOptions, Schema, Types } from 'mongoose';
import BaseRepository from '../../base/base.repository';
import mongooseConnector from './mongoose-connector.service';

export default class MongooseRepo implements BaseRepository {
  collection: string;
  schema: Schema<any>;

  constructor(collection: string, schema: Schema) {
    this.collection = collection;
    this.schema = schema;
  }

  private async createModel() {
    const connection = await mongooseConnector.connect();
    return connection.model(this.collection, this.schema);
  }

  generateId(): Types.ObjectId {
    return Types.ObjectId.createFromHexString(Types.ObjectId.generate().toString());
  }

  async count(filter?: Object): Promise<number> {
    const model = await this.createModel();
    return model.estimatedDocumentCount(filter).exec();
  }

  async get(
    filter: Record<string, unknown> = {},
    projection?: Object,
    options?: Object,
    populateFields?: string[] | QueryPopulateOptions[]
  ): Promise<{ data: Document[]; count: number }> {
    const model = await this.createModel();
    const result = await new Promise<{ data: Document[]; count: number }>(async (resolve) => {
      await model
        .find(filter, projection, options)
        .populate(populateFields)
        .exec(async (err, data) => {
          if (data.length > 0) {
            return await model.count({}).exec((err: NativeError, count: number) => resolve({ data, count }));
          }
        });
    });
    return result;
  }

  async getById(_id: string, populateFields?: string[] | QueryPopulateOptions[]): Promise<any> {
    const model = await this.createModel();
    return model.findById(_id).populate(populateFields).exec();
  }

  async getOne(filter?: Object, populateFields?: string[] | QueryPopulateOptions[]): Promise<any> {
    const model = await this.createModel();
    return model.findOne(filter).populate(populateFields).exec();
  }

  populate(query: Query<any>, fieldsToPopulate: string[] | QueryPopulateOptions[]): Query<any> {
    return query.populate(fieldsToPopulate);
  }

  async delete(_id: string): Promise<any | null> {
    const model = await this.createModel();
    return model.findByIdAndDelete(_id).exec();
  }

  async create(newDocument: any): Promise<any> {
    const model = await this.createModel();
    return model.create(newDocument);
  }

  createMany(newDocument: any[]): Promise<any> {
    return this.createMany(newDocument);
  }

  async update(_id: string, newDocument: any): Promise<any | null> {
    const model = await this.createModel();
    return model
      .findByIdAndUpdate(_id, newDocument, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async addArrayElement(id: any, propName: string, newElement: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndUpdate(
      id,
      { $addToSet: { [propName]: newElement } },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  async removeArrayElement(id: any, propName: string, elementToRemove: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndUpdate(
      id,
      { $pull: { [propName]: elementToRemove } },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  async updateArrayElement(_id: string, prop: string, arrayKey: string, arrayElementId: string, newArrayElement: any): Promise<any | null> {
    const Model = await this.createModel();
    const mongooseSetter = Object.entries(newArrayElement).reduce((mongooseUpdateObj, [key, value]) => {
      return key !== arrayKey
        ? {
            ...mongooseUpdateObj,
            [`${prop}.$.${key}`]: value,
          }
        : mongooseUpdateObj;
    }, {});

    return Model.updateOne(
      { _id, [`${prop}.${arrayKey}`]: arrayElementId },
      { $set: mongooseSetter },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  async findOneAndUpdate(filter: Object, newDocument: any): Promise<any | null> {
    const model = await this.createModel();
    return model
      .findOneAndUpdate(filter, newDocument, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async findOneAndDelete(filter: Object): Promise<any | null> {
    const model = await this.createModel();
    return model.findOneAndDelete(filter).exec();
  }

  async set(_id: string, newDocument: any): Promise<any | null> {
    const model = await this.createModel();
    return model
      .findByIdAndUpdate(_id, newDocument, {
        new: true,
        runValidators: true,
        upsert: true,
      })
      .exec();
  }
}
