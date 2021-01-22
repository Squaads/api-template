import { Request, Response } from 'express';
import queryParser from '../services/query-parser.service';
// import queryParser from "../services/query-parser.service";
import BaseManager from './base.manager';

export default class BaseController {
    baseManager: BaseManager;

    constructor(baseManager: BaseManager) {
        this.baseManager = baseManager;
    }

    public async getAll(req: Request, res: Response) {
        try {
            const filters = queryParser.getFilters(req.query);
            const projection = queryParser.getProjection(req.query);
            const options = queryParser.getOptions(req.query);
            const populate = queryParser.getPopulationOptions(req.query);
            const result = await this.baseManager.getAll(filters, projection, options, populate);
            if (!result) {
                throw new Error('No elements found');
            }
            return res.status(200).send({
                message: `Resources retrieved successfully`,
                data: result.data,
                _metada: {
                  page: result.page,
                  pages: result.pages
                }
            });
        } catch (e) {
            this.handleError(res, e);
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).send({ message: 'Missing fields' });
            }
            const populate = queryParser.getPopulationOptions(req.query);
            const data = await this.baseManager.getById(id, populate);
            if (!data) {
                throw new Error('API Error: error retrieving resource');
            }
            return res.status(200).send({
                message: `Resource retrieved successfully`,
                data: data,
            });
        } catch (e) {
            this.handleError(res, e);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { data } = req.body;
            if (!data) {
                return res.status(400).send({ message: 'Missing fields' });
            }
            const created = await this.baseManager.create(data);
            if (!created) {
                throw new Error('API Error: error creating resource');
            }
            return res.status(200).send({
                message: `Resource created successfully`,
                data: created,
            });
        } catch (e) {
            this.handleError(res, e);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({ message: 'Missing fields' });
            }
            const deleted = await this.baseManager.delete(id);

            if (!deleted) {
                throw new Error('API Error: error removing resource');
            }
            return res.status(200).send({
                message: `Resource deleted successfully`,
                data: deleted,
            });
        } catch (e) {
            this.handleError(res, e);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            if (!id && !data) {
                return res.status(400).send({ message: 'Missing fields' });
            }
            const updated = await this.baseManager.update(id, data);
            if (!updated) {
                throw new Error('API Error: error updating resource');
            }
            return res.status(200).send({
                message: `Resource updated successfully`,
                data: updated,
            });
        } catch (e) {
            this.handleError(res, e);
        }
    }

    public async set(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data } = req.body;
            if (!id && !data) {
                return res.status(400).send({ message: 'Missing fields' });
            }
            const updated = await this.baseManager.set(id, data);
            if (!updated) {
                throw new Error('API Error: error setting resource');
            }
            return res.status(200).send({
                message: `Resource updated successfully`,
                data: updated,
            });
        } catch (e) {
            this.handleError(res, e);
        }
    }

    public handleError(res: Response, err: any) {
        console.log(err);
        return res.status(500).send({ message: `${err.code} - ${err.message}` });
    }
}
