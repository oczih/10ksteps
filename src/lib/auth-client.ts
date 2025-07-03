import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import WalkUser from "@/app/models/usermodel";
import { connectDB } from "@/lib/mongoose";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();
      const provider = account?.provider;
      const providerId = account?.providerAccountId;

      let existingUser;

      if (provider === "google") {
        existingUser = await WalkUser.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await WalkUser.create({
            email: user.email,
            username: user.name?.replace(/\s+/g, "_").toLowerCase() || `google_user_${providerId}`,
            name: user.name,
            image: user.image,
            oauthProvider: "google",
            oauthId: providerId,
          });
        }
        user.email = existingUser.email;
        user.membership = existingUser.membership;
      }

      if (provider === "twitter") {
        const twitterId = providerId;
        existingUser = await WalkUser.findOne({ oauthId: twitterId });

        if (!existingUser) {
          existingUser = await WalkUser.create({
            email: "",
            username: user.name || `twitter_user_${twitterId}`,
            name: user.name,
            image: user.image,
            oauthProvider: "twitter",
            oauthId: twitterId,
          });
        }
        user.email = existingUser.email;
        user.membership = existingUser.membership;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.membership = user.membership ?? false;
      }
      return token;
    },

    async session({ session, token }) {
      if (!token?.email && !token?.sub) return session;
      await connectDB();

      const user = await WalkUser.findOne({
        $or: [{ email: token.email }, { oauthId: token.sub }],
      });

      if (user) {
        session.user = {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          image: user.image,
          name: user.name,
          age: user.age,
          weight: user.weight,
          height: user.height,
          gender: user.gender,
          activityLevel: user.activityLevel,
          goal: user.goal,
          goalWeight: user.goalWeight,
          googleId: user.googleId,
          pace: user.pace,
          membership: user.membership,
          hasAccess: user.hasAccess,
          lastUsernameChange: user.lastUsernameChange,
          isUsernameChangeBlocked: user.isUsernameChangeBlocked,
          emailVerified: user.emailVerified,
        };
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/subscribe`;
    },
  },
});

export { handler as GET, handler as POST };
