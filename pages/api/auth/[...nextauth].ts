import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Custom Login",
      credentials: {
        kode: { label: "Kode", type: "text", placeholder: "Masukkan kode" },
      },
      async authorize(credentials) {
        const validCodes = {
          approval: "approval", // Kode untuk masuk ke /approval
          komite: "komite", // Kode untuk masuk ke /komite
        };

        if (credentials?.kode === validCodes.approval) {
          return { id: "approval", name: "Approval User", role: "approval" };
        } else if (credentials?.kode === validCodes.komite) {
          return { id: "komite", name: "Komite User", role: "komite" };
        } else {
          throw new Error("Kode salah!");
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string | null | undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
