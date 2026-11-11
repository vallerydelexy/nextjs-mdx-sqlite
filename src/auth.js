import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    signIn({ profile }) {
      return Boolean(
        profile?.email_verified &&
          profile.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()
      );
    },
  },
});
