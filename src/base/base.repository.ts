export default interface BaseRepository {
  count(filter?: any): Promise<any>;
  get(filter?: any, projection?: any, options?: any, populateFields?: any): Promise<any>;
  getSubItems(itemId: string, filter?: any, projection?: any, options?: any): Promise<any>;
  getById(id: any, populateFields?: any): Promise<any>;
  getOne(filter: Record<string, unknown>, populateFields?: any): Promise<any>;

  create(newDocument: any): Promise<any>;
  createMany(newDocument: any): Promise<any>;

  update(id: any, newDocument: any): Promise<any>;
  updateMany(query: any, newDocument: any): Promise<any>;
  addArrayElement(id: any, propName: string, newElement: any): Promise<any>;
  removeArrayElement(id: any, propName: string, elementToRemove: any): Promise<any>;
  updateArrayElement(id: string, prop: string, arrayKey: string, arrayElementId: string, newArrayElement: any): Promise<any>;
  set(id: any, newDocument: any): Promise<any>;

  delete(id: any): Promise<any>;

  validate(newDocument: any): Promise<any>;
}
