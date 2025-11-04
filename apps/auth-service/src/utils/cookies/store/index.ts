import { Response } from "express";

const storeSetCookies = (res: Response, name: string, value: string) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years in milliseconds
  });
};

export default storeSetCookies;
