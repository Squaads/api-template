import { Response } from "express";

class ResponseService {
    success(res: Response, text: string, data: any = null) {
        return res.status(200).json({
            status:200,
            text,
            data: data !== null ? data : {}
        })
    }

    error(res: Response, err: any) {
        return this.handleError(res, err);
    }

    private handleError(res: Response, err: any) {
        const text = err && err.code && err.message ? `${err.code} - ${err.message}` : `${err}`
        return res.status(400).send({ 
            status: 400,
            text,
            data: {}
        });
    }    
}

export interface customResponse {
    status: number,
    text: string,
    data?: {}
}

export default new ResponseService();