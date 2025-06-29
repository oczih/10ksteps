import { connectDB } from './mongoose';
import WalkUser from "@/app/models/usermodel";
import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig  = {
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      Twitter({
        clientId: process.env.TWITTER_CLIENT_ID!,
        clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      }),
      credentials({
        name: "Credentials",
        id: "credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            await connectDB();
            const user = await WalkUser.findOne({
            email: credentials?.email,
            }).select("+password");
            if (!user) throw new Error("Wrong Email");
            const passwordMatch = await bcrypt.compare(
            credentials!.password as string,
            user.password
            );
            if (!passwordMatch) throw new Error("Wrong Password");
            return user;
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === "google" || account?.provider === "twitter") {
          await connectDB();
          
          // Check if user already exists
          let existingUser = await WalkUser.findOne({ email: user.email });
          
          if (!existingUser) {
            // Generate a unique username
            let username = user.name || user.email?.split('@')[0] || `user_${Date.now()}`;
            
            // Ensure username is unique
            let counter = 1;
            const originalUsername = username;
            while (await WalkUser.findOne({ username })) {
              username = `${originalUsername}_${counter}`;
              counter++;
            }
            
            // Create new user from OAuth
            existingUser = await WalkUser.create({
              email: user.email,
              username: username,
              name: user.name || username,
              image: user.image,
              oauthProvider: account.provider,
              oauthId: profile?.sub || profile?.id,
            });
          }
          
          return true;
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.username = user.username;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id as string;
          session.user.username = token.username as string;
        }
        return session;
      },
    },
  };