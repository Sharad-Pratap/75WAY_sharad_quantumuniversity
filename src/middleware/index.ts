import express, { NextFunction } from 'express';
import { decode } from 'jsonwebtoken';
import { get, identity, merge } from 'lodash';


export const isOwner = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const { id } = req.params;
        const currentUserId = get(req, ['identity', '_id']) as string ?? '';

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(400);
    }

    next();
    }
    catch(error){
        console.log(error);
        return res.sendStatus(400);
        
    }
}

export const isAuthenticated = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.cookies['access-token'];

        if(!sessionToken){
            return res.sendStatus(403);
        }

        const existingUser = await (sessionToken);

        if(!existingUser){
            return res.sendStatus(403);
        }
        

        merge(req, { identity: existingUser });

        return next();

    }
    catch(error){
        console.log(error);
        return res.sendStatus(400);
        
    }
}