interface ironOptionType {
  password: string;
  cookieName: string;
  cookieOptions: {
    maxAge: number,
    secure: boolean,
  };
}

export const ironOption: ironOptionType = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  cookieOptions: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
  },
};
