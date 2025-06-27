import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import client from "./db";
import WalkUser from "@/app/models/usermodel"; // your Mongoose model
import { connectDB } from "@/lib/mongoose";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })],

  callbacks: {
    async session({ session }) {
      if (!session.user?.email) return session;
      await connectDB();
      const user = await WalkUser.findOne({ email: session.user.email });

      if (user) {
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
      }

      return session;
    },
  },

  events: {
    async signIn({ user, account }) {
      await connectDB();
      const existingUser = await WalkUser.findOne({ email: user.email });
      if (!existingUser) {
        try {
          await WalkUser.create({
            name: user.name,
            email: user.email,
            username: (user.email?.split("@")[0] || "user") + Math.floor(Math.random() * 10000),
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
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    },
  },
});
