import { CookieOptions, Request, Response } from 'express';
import { TokenType } from '../enums';

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions,
) => {
  res.cookie(name, value, options);
};

export const getCookie = (req: Request, name: string) => {
  return req.cookies[name];
};

export const deleteCookie = (res: Response, name: string) => {
  res.clearCookie(name);
};

export const setAuthToken = (
  res: Response,
  tokenType: TokenType,
  token: string,
) => {
  setCookie(res, tokenType, token, {
    // httpOnly: true,  // Cookie cannot be accessed via client-side script
    httpOnly: false, // Cookie cannot be accessed via client-side script
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // Protect against CSRF
    // sameSite: 'lax',  // Less restrictive than 'strict', works better with GraphQL
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    path: '/', // Cookie is available for all paths
  });
};

export const deleteAuthToken = (res: Response, tokenType: TokenType) => {
  deleteCookie(res, tokenType);
};
