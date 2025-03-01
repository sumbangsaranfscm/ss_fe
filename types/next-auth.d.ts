/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string | undefined | null;
    };
  }

  interface User {
    role: string | undefined | null;
  }
}