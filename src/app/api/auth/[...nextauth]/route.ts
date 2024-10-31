import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create and export the handler
const handler = NextAuth(authOptions);

// Export the GET and POST handlers
export { handler as GET, handler as POST };