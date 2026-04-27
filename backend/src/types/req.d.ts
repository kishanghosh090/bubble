interface Request extends Express.Request {
  user?: {
    id: string;
  };
  query: {
    [key: string]: string | undefined;
  };
}

interface Response extends Express.Response {}
