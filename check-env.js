const fs = require('fs');
const path = require('path');

console.log("=== CHECKING .env.local FILE ===");

try {
  const envPath = path.join(__dirname, '.env.local');
  console.log("Looking for .env.local at:", envPath);
  
  if (fs.existsSync(envPath)) {
    console.log("✅ .env.local file exists");
    const content = fs.readFileSync(envPath, 'utf8');
    console.log("File size:", content.length, "characters");
    console.log("First 200 characters:", content.substring(0, 200));
    
    // Check for MONGO_URI line
    const lines = content.split('\n');
    const mongoLine = lines.find(line => line.startsWith('MONGO_URI'));
    if (mongoLine) {
      console.log("✅ Found MONGO_URI line:", mongoLine.substring(0, 50) + "...");
    } else {
      console.log("❌ MONGO_URI line not found");
    }
  } else {
    console.log("❌ .env.local file does not exist");
  }
} catch (error) {
  console.error("Error reading .env.local:", error);
}

console.log("=== END CHECK ==="); 