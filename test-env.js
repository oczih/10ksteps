// Test environment variables
console.log("=== ENVIRONMENT VARIABLES TEST ===");
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("MONGO_URI type:", typeof process.env.MONGO_URI);
console.log("MONGO_URI length:", process.env.MONGO_URI?.length);
console.log("All env vars with MONGO:", Object.keys(process.env).filter(key => key.includes('MONGO')));
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("=== END TEST ==="); 