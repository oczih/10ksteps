import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import WalkUser from "@/app/models/usermodel";
import { connectDB } from "@/lib/mongoose";

export const { handlers, signIn, signOut, auth } = NextAuth({
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

      if (account?.provider === "twitter") {
        const twitterId = account.providerAccountId;
        const fallbackEmail = `twitter_${twitterId}@example.com`;

        let existingUser = await WalkUser.findOne({ oauthId: twitterId });

        if (!existingUser) {
          existingUser = await WalkUser.create({
            email: fallbackEmail,
            username: user.name || `twitter_user_${twitterId}`,
            name: user.name,
            image: user.image,
            oauthProvider: "twitter",
            oauthId: twitterId,
          });
        }

        // Inject fallback email so it propagates into JWT/session
        user.email = existingUser.email;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (!token?.email && !token?.sub) return session;

      await connectDB();

      const user = await WalkUser.findOne({
        $or: [
          { email: token.email },
          { oauthId: token.sub }, // fallback for Twitter
        ],
      });

      if (user) {
        session.user.id = user._id.toString();
        session.user.username = user.username;
        session.user.email = user.email;
        session.user.image = user.image;
        session.user.name = user.name;
        session.user.age = user.age;
        session.user.weight = user.weight;
        session.user.height = user.height;
        session.user.gender = user.gender;
        session.user.activityLevel = user.activityLevel;
        session.user.goal = user.goal;
        session.user.goalWeight = user.goalWeight;
        session.user.googleId = user.googleId;
        session.user.pace = user.pace;
        session.user.membership = user.membership;
        session.user.hasAccess = user.hasAccess;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/map`;
    },
  },
});
