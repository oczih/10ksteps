import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import WalkUser from "@/app/models/usermodel"; // your Mongoose model
import { connectDB } from "@/lib/mongoose";
import Twitter from "next-auth/providers/twitter"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "twitter") {
        await connectDB();
        
        // For Twitter, if no email is provided, generate a fallback
        let userEmail = user.email;
        if (!userEmail && account.provider === "twitter") {
          userEmail = `twitter_${account.providerAccountId}@example.com`;
        }
        
        // If still no email, deny sign in
        if (!userEmail) {
          return false;
        }
        
        // Check if user already exists
        let existingUser = await WalkUser.findOne({ email: userEmail });
        
        if (!existingUser) {
          // Generate a unique username
          let username = user.name || userEmail?.split('@')[0] || `user_${Date.now()}`;
          
          // Ensure username is unique
          let counter = 1;
          const originalUsername = username;
          while (await WalkUser.findOne({ username })) {
            username = `${originalUsername}_${counter}`;
            counter++;
          }
          
          // Create new user from OAuth
          existingUser = await WalkUser.create({
            email: userEmail,
            username: username,
            name: user.name || username,
            image: user.image,
            oauthProvider: account.provider,
            oauthId: account.providerAccountId,
            password: "",
            walkingroutes: [],
            weight: 0,
            height: 0,
            age: 0,
            gender: "not specified",
            activityLevel: "moderate",
            goal: "maintain",
            goalWeight: 0,
            googleId: account?.providerAccountId || null,
          });
        }
        
        return true;
      }
      return true;
    },

    async session({ session, token }) {
      if (!session.user?.email) return session;
      
      try {
        await connectDB();
        const user = await WalkUser.findOne({ email: session.user.email });

        if (user) {
          // Populate all user fields in the session
          session.user.id = user._id.toString();
          session.user.username = user.username;
          session.user.age = user.age;
          session.user.weight = user.weight;
          session.user.height = user.height;
          session.user.gender = user.gender;
          session.user.activityLevel = user.activityLevel;
          session.user.goal = user.goal;
          session.user.goalWeight = user.goalWeight;
          session.user.googleId = user.googleId;
          session.user.pace = user.pace;
          session.user.name = user.name;
          session.user.email = user.email;
          session.user.image = user.image;
        } else if (token) {
          session.user.id = token.id as string;
          session.user.username = token.username as string;
        }
      } catch {
        if (token) {
          session.user.id = token.id as string;
          session.user.username = token.username as string;
        }
      }

      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      
      if (account && user?.email) {
        try {
          await connectDB();
          const dbUser = await WalkUser.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.username = dbUser.username;
          }
        } catch {
          // Handle error silently
        }
      }
      
      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
});
