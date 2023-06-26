// nextauth options from /lib/session
import NextAuth from "next-auth";

import { authOptions } from "@/lib/session";

const handler = NextAuth(authOptions);
console.log("nextauth endpoint hit");

export { handler as GET, handler as POST };