// drizzle.config.js

const dotenv = require('dotenv');
const path = require('path');

// Load .env.local file
const envPath = path.resolve(__dirname, '.env.local');
dotenv.config({ path: envPath });

/** @type { import("drizzle-kit").Config } */
const config = {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL,
    }
};

// For debugging, log the URL to ensure it's correctly loaded
console.log('Database URL:', process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL);

module.exports = config;
