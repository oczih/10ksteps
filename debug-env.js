// Debug environment variables
console.log("=== ENVIRONMENT VARIABLES DEBUG ===");

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL', 
  'MONGO_URI',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_MAPBOX_TOKEN',
  'GEMINI_API_KEY'
];

console.log("Checking required environment variables:");
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const hasValue = !!value;
  const length = value ? value.length : 0;
  console.log(`${varName}: ${hasValue ? '✅' : '❌'} (length: ${length})`);
  if (hasValue && length < 10) {
    console.log(`  ⚠️  ${varName} seems too short`);
  }
});

console.log("\n=== NODE_ENV ===");
console.log("NODE_ENV:", process.env.NODE_ENV);

console.log("\n=== Optional Variables ===");
const optionalVars = [
  'TWITTER_CLIENT_ID',
  'TWITTER_CLIENT_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
];

optionalVars.forEach(varName => {
  const value = process.env[varName];
  const hasValue = !!value;
  console.log(`${varName}: ${hasValue ? '✅' : '⚠️  (not set)'}`);
});

console.log("\n=== END DEBUG ==="); 