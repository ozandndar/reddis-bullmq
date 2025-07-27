import Bull from "bull";
import { sleep } from "../utils.js";
import { QUEUE_NAMES, JOB_TYPES, REDIS_CONFIG } from "../constants.js";

// Create purchase queue
export const purchaseQueue = new Bull(QUEUE_NAMES.PURCHASE, REDIS_CONFIG);

// Purchase queue processors
purchaseQueue.process(JOB_TYPES.PURCHASE.CONFIRMATION, async (job) => {
    const { orderId, customerEmail, customerName, orderDetails } = job.data;
    
    try {
        job.log(`Processing purchase confirmation for order ${orderId}`);
        job.progress(10);
        
        // Generate receipt
        job.log('Generating purchase receipt...');
        await sleep(700);
        job.progress(30);
        
        // Update inventory
        job.log('Updating inventory...');
        await sleep(500);
        job.progress(50);
        
        // Send confirmation email
        job.log('Sending purchase confirmation email...');
        await sleep(1000);
        job.progress(80);
        
        // Random failure simulation (5% chance)
        if (Math.random() < 0.05) {
            throw new Error('Failed to process purchase confirmation');
        }
        
        job.log('Purchase confirmation completed');
        job.progress(100);
        
        return {
            status: 'completed',
            orderId,
            receiptId: `receipt_${Date.now()}`,
            processedAt: new Date().toISOString()
        };
        
    } catch (error) {
        job.log(`Failed to process purchase: ${error.message}`);
        throw error;
    }
});
