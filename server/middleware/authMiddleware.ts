interface Request {
  session: {
    accessToken?: string;
  };
}

interface Response {
  status: (code: number) => {
    send: (message: string) => void;
  };
}

type NextFunction = () => void;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.session;
  if (!accessToken || isExpired(accessToken)) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

const isExpired = (token: string): boolean => {
  // TODO: Implement logic to check if token has expired
  // For now, we'll return false as a placeholder
  return false;
};
