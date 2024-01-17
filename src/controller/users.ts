import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/user';

export const getAllUsers = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const users = await getUsers();

        return res.status(200).json(users);

    }
    catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}
