// Check NextAuth secret configuration
console.log("=== NEXTAUTH SECRET CHECK ===");

const secret = process.env.NEXTAUTH_SECRET;

console.log("NEXTAUTH_SECRET exists:", !!secret);
console.log("NEXTAUTH_SECRET length:", secret?.length || 0);
console.log("NEXTAUTH_SECRET preview:", secret ? secret.substring(0, 10) + "..." : "undefined");

if (!secret) {
  console.log("❌ NEXTAUTH_SECRET is missing!");
  console.log("This will cause authentication to fail.");
} else if (secret.length < 32) {
  console.log("⚠️  NEXTAUTH_SECRET is too short (should be 32+ characters)");
} else {
  console.log("✅ NEXTAUTH_SECRET looks good");
}

console.log("\n=== OTHER CRITICAL VARS ===");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

console.log("\n=== SECRET GENERATION ===");
console.log("To generate a new secret, run this command:");
console.log("openssl rand -base64 32");
console.log("or use: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"");

console.log("\n=== END CHECK ==="); 