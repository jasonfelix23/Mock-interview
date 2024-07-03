/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: "postgresql://neondb_owner:fgOzt1lq9mdF@ep-red-glade-a5huz1nq.us-east-2.aws.neon.tech/neondb?sslmode=require",
    }
};