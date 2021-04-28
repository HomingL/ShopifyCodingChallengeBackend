
declare namespace Express {
  export interface Request {
     username?: string;
     isPublic: boolean;
  }

}

// declare module 'express-session'{
//   interface Session {
//     username: string;
//   }
// }

// declare namespace Express.Request {
//   export interface session {
//     username?: string
//   }
  
//   export interface Partial<SessionData> {
//     username?: string
//   }
// }