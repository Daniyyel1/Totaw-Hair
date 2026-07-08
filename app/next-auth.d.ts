import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      bio?: string;
      profilePicture?: string;
      telephone?: number;
    } & DefaultSession["user"];
  }
}