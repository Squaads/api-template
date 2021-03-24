import { Query, QueryPopulateOptions, Schema, Types } from 'mongoose';
import BaseRepository from '../../base/base.repository';
import mongooseConnector, { MONGOOSE_MODELS } from './mongoose-connector.service';

export default class MongooseRepo implements BaseRepository {
  collection: string;
  schema: Schema<any>;

  constructor(collection: string, schema?: Schema) {
    this.collection = collection;
    this.schema = schema || this.getSchema(collection);
  }

  private getSchema(entity: string): Schema {
    const schema = MONGOOSE_MODELS.find((model) => model.name === entity)?.schema;
    if (!schema) {
      throw new Error('No schema found!');
    }

    return schema;
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
  ): Promise<any[]> {
    const Model = await this.createModel();
    return Model.find(filter, projection, options).populate(populateFields).exec();
  }

  async getSubItems(itemId: string, filter: Record<string, unknown> = {}): Promise<any[]> {
    const Model = await this.createModel();
    return Model.find({ _id: itemId }, filter).exec();
  }

  async getById(_id: string, populateFields?: string[] | QueryPopulateOptions[]): Promise<any> {
    const Model = await this.createModel();
    return Model.findById(_id).populate(populateFields).exec();
  }

  async create(newDocument: any): Promise<any> {
    const Model = await this.createModel();
    return Model.create(newDocument);
  }

  async createMany(newDocument: any): Promise<any> {
    const Model = await this.createModel();
    return Model.insertMany(newDocument);
  }

  async update(_id: string, newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndUpdate(_id, newDocument, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async updateMany(query: any, newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.updateMany(query, newDocument, {
      new: true,
      runValidators: true,
    }).exec();
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

  async set(_id: string, newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndUpdate(_id, newDocument, {
      new: true,
      runValidators: true,
      upsert: true,
    }).exec();
  }

  async delete(_id: string): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndDelete(_id).exec();
  }

  async validate(newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    const document = new Model(newDocument);
    return document.validate();
  }

  private populate(query: Query<any>, fieldsToPopulate: string[] | QueryPopulateOptions[]): Query<any> {
    return query.populate(fieldsToPopulate);
  }

  async getOne(filter?: Object, populateFields?: string[] | QueryPopulateOptions[]): Promise<any> {
    const Model = await this.createModel();
    return Model.findOne(filter).populate(populateFields).exec();
  }

  private async findOneAndUpdate(filter: Object, newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findOneAndUpdate(filter, newDocument, {
      new: true,
      runValidators: true,
    }).exec();
  }

  private async findOneAndDelete(filter: Object): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findOneAndDelete(filter).exec();
  }
}
