import { NextFunction, Request, Response } from 'express';

class AuthMiddleware {
    public allowWhiteListUrls = (whiteList: string[]) => async (req: Request, res: Response, next: NextFunction) => {
        const urlParts = req.url.split('/');

        if (whiteList.find((url) => urlParts[urlParts.length - 1].includes(url))) {
            return next();
        } else {
            // Check if user Logged
        }
        return res.status(401).send({ message: 'Unauthorized' });
    };

    public async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        const result = await this.validToken(req);
        if (result) {
            return next();
        } else return res.status(401).send({ message: 'Unauthorized' });
    }

    private async validToken(req: Request): Promise<boolean> {
        // TODO: Check if token is valid
        return true;
    }
}

export default new AuthMiddleware();
