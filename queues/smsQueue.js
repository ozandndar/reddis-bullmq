import Bull from "bull";
import { sleep } from "../utils.js";
import { QUEUE_NAMES, JOB_TYPES, REDIS_CONFIG } from "../constants.js";

// Create SMS queue
export const smsQueue = new Bull(QUEUE_NAMES.SMS, REDIS_CONFIG);

// SMS processing job handlers
smsQueue.process(JOB_TYPES.SMS.LOGIN, async (job) => {
    const { phoneNumber, verificationCode, userName } = job.data;
    
    try {
        job.log(`Sending login SMS to ${phoneNumber}`);
        job.progress(20);
        
        // Validate phone number format
        job.log('Validating phone number...');
        await sleep(300);
        job.progress(40);
        
        // Send SMS via SMS service (Twilio, etc.)
        job.log('Sending SMS via SMS gateway...');
        await sleep(800);
        job.progress(80);
        
        // Random failure simulation (2% chance)
        if (Math.random() < 0.02) {
            throw new Error('SMS gateway unavailable');
        }
        
        job.log('Login SMS sent successfully');
        job.progress(100);
        
        return {
            status: 'sent',
            phoneNumber,
            sentAt: new Date().toISOString(),
            messageId: `sms_${Date.now()}`
        };
        
    } catch (error) {
        job.log(`Failed to send login SMS: ${error.message}`);
        throw error;
    }
});
