import BaseRepository from './base.repository';

export default class BaseModel<S, T> {
    protected repo: BaseRepository;

    constructor(repo: BaseRepository) {
        this.repo = repo;
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

    async getAll(filters: Record<string, unknown>, projection?: string, options?: Record<string, unknown>): Promise<{data: T[], count: number, page: number, pages:number}> {
        const {skip, limit }: {skip: number, limit:number} = options as any;
        const {data, count} = await this.repo.get(filters, projection, options);
        return {
            data,
            count,
            page: skip ? Math.round(skip/limit) : Math.round(1/limit),
            pages: limit ? Math.round(count/limit) : Math.round(count/10)
        }
    }
    getPopulatedById(id: string, populateFields: string[]): Promise<T> {
        return this.repo.getById(id, populateFields);
    }

    async getAllPopulated(
        filters: Record<string, unknown>,
        projection?: string,
        options?: Record<string, unknown>,
        populateFields?: string[]
    ): Promise<{data: T[], count: number, page: number, pages:number}> {
        const {skip, limit }: {skip: number, limit:number} = options as any;
        const {data, count} = await this.repo.get(filters, projection, options, populateFields);
        return {
            data,
            count,
            page: skip ? Math.round(skip/limit) : Math.round(1/limit),
            pages: limit ? Math.round(count/limit) : Math.round(count/10)
        }
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
