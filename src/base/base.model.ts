import BaseRepository from './base.repository';

export default class BaseModel<S, T> {
  protected repo: BaseRepository;

  constructor(repo: BaseRepository) {
    this.repo = repo;
  }

  count(filters: Object): Promise<number> {
    return this.repo.count(filters);
  }

  create(entity: S): Promise<T> {
    return this.repo.create(entity);
  }

  createMany(entity: S[]): Promise<T> {
    return this.repo.createMany(entity);
  }

  getById(id: string): Promise<T> {
    return this.repo.getById(id);
  }

  async getAll(filters: Record<string, unknown>, projection?: string, options?: Record<string, unknown>): Promise<T[]> {
    return this.repo.get(filters, projection, options);
  }

  getPopulatedById(id: string, populateFields: string[]): Promise<T> {
    return this.repo.getById(id, populateFields);
  }

  async getAllPopulated(
    filters: Record<string, unknown>,
    projection?: string,
    options?: Record<string, unknown>,
    populateFields?: string[]
  ): Promise<T[]> {
    return this.repo.get(filters, projection, options, populateFields);
  }

  update(id: string, newEntity: Record<string, unknown>): Promise<T> {
    return this.repo.update(id, newEntity);
  }

  set(id: string, newEntity: S): Promise<T> {
    return this.repo.set(id, newEntity);
  }

  delete(id: string): Promise<T> {
    return this.repo.delete(id);
  }
}
