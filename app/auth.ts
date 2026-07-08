// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import { dbConnect } from "./lib/mongo";
// import Credentials from "next-auth/providers/credentials";
// import usersModel from "./model/users-model";
// import bcrypt from "bcryptjs";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   secret: process.env.AUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     session({ session, token }) {
//       session.user.id = token.sub ?? ""; //
//       return session;
//     },
//   },

//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,

//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),

//     Credentials({
//       async authorize(credentials) {
//         if (credentials === null) return null;

//         const email = credentials?.email as string;
//         const password = credentials?.password as string;

//         try {
//           await dbConnect();
//           const user = await usersModel.findOne({ email: email });
//           if (user) {
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (isMatch) {
//               return user;
//             } else {
//               throw new Error("check your password");
//             }
//           } else {
//             throw new Error("user not found");
//           }
//         } catch (error) {
//           throw new Error(
//             error instanceof Error ? error.message : "Authorization failed",
//           );
//         }
//       },
//     }),
//   ],
// });

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { dbConnect } from "./lib/mongo";
import Credentials from "next-auth/providers/credentials";
import usersModel from "./model/users-model";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();

          const existingUser = await usersModel.findOne({ email: user.email });

          if (existingUser) {
            user.id = existingUser._id.toString();
            return true;
          }

          const newUser = await usersModel.create({
            name: user.name,
            email: user.email,
            profilePicture: user.image,
          });

          user.id = newUser._id.toString();
          return true;
        } catch (error) {
          console.error("Google signIn error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // Only runs on initial sign-in — keep the token light, no DB blobs
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },

    session({ session, token }) {
      session.user.id = token.sub ?? "";
      return session;
    },
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    Credentials({
      async authorize(credentials) {
        if (credentials === null) return null;

        const email = credentials?.email as string;
        const password = credentials?.password as string;

        try {
          await dbConnect();
          const user = await usersModel.findOne({ email: email });
          if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
              };
            } else {
              throw new Error("check your password");
            }
          } else {
            throw new Error("user not found");
          }
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Authorization failed",
          );
        }
      },
    }),
  ],
});
