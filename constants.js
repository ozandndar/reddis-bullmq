import dotenv from "dotenv";

dotenv.config();

// Environment variables
export const ENV = {
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    PORT: process.env.PORT || 3000
};

// Job priority constants
export const PRIORITY = {
    CRITICAL: 1,    // Login SMS, security-related
    HIGH: 3,        // Email verification, account actions
    MEDIUM: 5,      // Purchase confirmations
    LOW: 7,         // Welcome emails
    BULK: 10        // Newsletters, marketing emails
};

// Queue names
export const QUEUE_NAMES = {
    EMAIL: "email-queue",
    SMS: "sms-queue", 
    PURCHASE: "purchase-queue"
};

// Job types
export const JOB_TYPES = {
    EMAIL: {
        WELCOME: "welcome-email",
        VERIFICATION: "email-verification",
        NEWSLETTER: "newsletter"
    },
    SMS: {
        LOGIN: "login-sms"
    },
    PURCHASE: {
        CONFIRMATION: "purchase-confirmation"
    }
};

// Redis configuration for Bull queue
export const REDIS_CONFIG = {
    redis: {
        host: ENV.REDIS_HOST,
        port: parseInt(ENV.REDIS_PORT),
        password: ENV.REDIS_PASSWORD,
    },
    settings: {
        stalledInterval: 30 * 1000,    // Check for stalled jobs every 30 seconds
        maxStalledCount: 1,            // Max number of times a job can be stalled
    }
};

// List of all queue names for Bull Board
export const QUEUE_LIST = Object.values(QUEUE_NAMES);
