import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from 'jsonwebtoken'
import { JWT } from "next-auth/jwt";

import { createUser, getUser } from "./actions";
import { SessionInterface, UserProfile } from "@/common.types";

// The options for auth
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // JWt- 
  jwt: {    
    encode: ({ secret, token }) => {
        
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      );
      // test
      // console.log("Session encodedToken:",encodedToken);
      return encodedToken;
    },
    // decode
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;
      return decodedToken;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
  },
  callbacks: {
    async session({ session }) {
        // get email of user
      const email = session?.user?.email as string;
        // get user data
      try { 
        const data = await getUser(email) as { user?: UserProfile }
        // add the data to the session
        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
          },
        };
        // return the new session
        return newSession;
      } catch (error: any) {
        console.error("Error retrieving user data: ", error.message);
        return session;
      }
    },
    // AdapterUser = google user
    // signIn
    async signIn({ user }: {
      user: AdapterUser | User
    }) 
      // check for user
    {
      try {
        // console.log("checking for user")
        const userExists = await getUser(user?.email as string) as { user?: UserProfile }
        
        if (!userExists.user) {
          // if not found, create user
          console.log("Creating new user")
          await createUser(user.name as string, user.email as string, user.image as string)
        }
        // return true
        // console.log("userExists",userExists)
        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
};

// Get current user - is called on page load by navbar
export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as SessionInterface;
  // testing - log the session
  // console.log("Session object ",session)
  
  // return session object
  return session;
}