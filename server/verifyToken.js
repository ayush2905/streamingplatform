import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token               //access_token created at time of sign in is used to verify
    console.log(token);
    if(!token) return next(createError(401, "You are not authenticated"));   //createError takes status and message as arguments

    jwt.verify(token, process.env.JWT, (err, user) => {         //verifictaion function will either return error or our info
        if(err) return next(createError(403, "Token is not valid!"));
        req.user = user;        //right user is jwt object  && left user is same as that provided in the arguments
        next()   //its gonna continue where we left for eg if verified it will go to update fn

    });
};