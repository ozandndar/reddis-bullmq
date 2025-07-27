import { emailQueue, smsQueue, purchaseQueue } from "./queues/index.js";
import { createJobs } from "./jobCreator.js";
import { setupQueueMonitoring, gracefulShutdown } from "./queueMonitoring.js";

// All queues array for easy management
const allQueues = [emailQueue, smsQueue, purchaseQueue];

// Setup monitoring for all queues
setupQueueMonitoring(allQueues);

// Start creating jobs
createJobs();

// Graceful shutdown
console.log('\n🚀 All queues are running. Press Ctrl+C to exit.\n');
process.on('SIGINT', () => gracefulShutdown(allQueues));
