import { model, Query, QueryPopulateOptions, Schema, Types } from 'mongoose';

export default class MongooseRepo {
  collection: string;
  schema: Schema<any>;

  constructor(collection: string, schema: Schema) {
    this.collection = collection;
    this.schema = schema;
  }

  private createModel() {
    return model(this.collection, this.schema);
  }

  generateId(): Types.ObjectId {
    return Types.ObjectId.createFromHexString(Types.ObjectId.generate().toString());
  }

  get(
    filter: Record<string, unknown>,
    projection?: Object,
    options?: Object,
    populateFields?: string[] | QueryPopulateOptions[]
  ): Promise<any[]> {
    return this.createModel().find(filter, projection, options).populate(populateFields).exec();
  }

  getById(_id: string, populateFields?: string[] | QueryPopulateOptions[]): Promise<any> {
    return this.createModel().findById(_id).populate(populateFields).exec();
  }

  getOne(filter?: Object, populateFields?: string[] | QueryPopulateOptions[]): Promise<any> {
    return this.createModel().findOne(filter).populate(populateFields).exec();
  }

  populate(query: Query<any>, fieldsToPopulate: string[] | QueryPopulateOptions[]): Query<any> {
    return query.populate(fieldsToPopulate);
  }

  delete(_id: string): Promise<any | null> {
    return this.createModel().findByIdAndDelete(_id).exec();
  }

  create(newDocument: any): Promise<any> {
    return this.createModel().create(newDocument);
  }

  update(_id: string, newDocument: any): Promise<any | null> {
    return this.createModel()
      .findByIdAndUpdate(_id, newDocument, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  findOneAndUpdate(filter: Object, newDocument: any): Promise<any | null> {
    return this.createModel()
      .findOneAndUpdate(filter, newDocument, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  findOneAndDelete(filter: Object): Promise<any | null> {
    return this.createModel().findOneAndDelete(filter).exec();
  }

  set(_id: string, newDocument: any): Promise<any | null> {
    return this.createModel()
      .findByIdAndUpdate(_id, newDocument, {
        new: true,
        runValidators: true,
        upsert: true,
      })
      .exec();
  }
}
