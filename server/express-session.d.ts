declare global {
    namespace Express {
      interface Request {
        session: any;  // Adjust 'any' to the type you expect for the session object
      }
    }
  }
