import { NextFunction, Request, Response } from "express";
import admin = require("firebase-admin");
import { RoleEnum } from "../../types/role.enum";

class AuthMiddleware {

    public allowWhiteListUrls = (whiteList: string[]) => async (req: Request, res: Response, next: NextFunction) => {
        const urlParts = req.url.split('/');
        console.log(urlParts[urlParts.length-1]);
        
        if(whiteList.find(url => url == urlParts[urlParts.length-1])) {
            return next();
        } else {
            const result: {token?: admin.auth.DecodedIdToken | null, error?: string} = await this.validToken(req);
            console.log(result)
            if (result.token) {
                if (this.validRole(req, result.token.uid, result.token.role, {hasRole: [RoleEnum.ADMIN,RoleEnum.NORMAL]})) 
                    return next();
            }
        }
        return res.status(401).send({ message: 'Unauthorized' });
    }
    
    public async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        const result = await this.validToken(req);
        if (result.token) {
            res.locals = { ...res.locals, uid: result.token.uid, role: result.token.role, email: result.token.email }
            return next();
        } else if (result.error)
            return res.status(401).send({ message: 'Unauthorized' });
        else return res.status(401).send({ message: 'Unauthorized' });
    }

    private async validToken(req: Request): Promise<{token?: admin.auth.DecodedIdToken | null, error?: string}> {
        
        const { authorization } = req.headers

        if (!authorization)
            return { token: null};

        if (!authorization.startsWith('Bearer'))
            return { token: null};

        const split = authorization.split('Bearer ')
        if (split.length !== 2)
            return { token: null};

        const token = split[1];

        try {
            const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
            // console.log("decodedToken", JSON.stringify(decodedToken));
            return { token: decodedToken};
        }
        catch (err) {
            console.error(`${err.code} -  ${err.message}`)
            return { error: `${err.code} -  ${err.message}`};
        }
    }

    public isAuthorized(opts: { hasRole: Array<RoleEnum.ADMIN | RoleEnum.NORMAL>, allowSameUser?: boolean }) {
        return (req: Request, res: Response, next: Function) => {
            const { role, uid } = res.locals
            if (this.validRole(req, uid, role, opts))
                return next();
            else 
                return res.status(403).send();
        }
    }

    private validRole(req: Request, decodedUid: string, decodedRole: RoleEnum, opts: { hasRole: Array<RoleEnum.ADMIN | RoleEnum.NORMAL>, allowSameUser?: boolean }): boolean {
        const { id } = req.params
        if (opts.allowSameUser && id && decodedUid === id)
            return true;

        if (!decodedRole)
            return false;

        if (opts.hasRole.includes(decodedRole))
            return true;

        return false;
    }

    /*public async verifyToken(req: Request, res: Response, next: NextFunction) {
        const idToken: any = req.headers.authorization;

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);

            if (decodedToken) {
                req.body.uid = decodedToken;
                next();
            }
            else
                res.status(401).send({ message: 'You are not authorized' });
        } catch (err) {
            res.status(401).send({ message: 'You are not authorized' });
        }
    }*/
}

const authMiddleware = new AuthMiddleware();

export default authMiddleware;