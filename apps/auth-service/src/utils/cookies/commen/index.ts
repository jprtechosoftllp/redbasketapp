import { Response } from "express";

const setCookies = (res: Response, name: string, value: string)=> {
    res.cookie(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

export default setCookies;