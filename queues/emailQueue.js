import Bull from "bull";
import { sleep } from "../utils.js";
import { QUEUE_NAMES, JOB_TYPES, REDIS_CONFIG } from "../constants.js";

// Create email queue
export const emailQueue = new Bull(QUEUE_NAMES.EMAIL, REDIS_CONFIG);

// Email processing job handlers
emailQueue.process(JOB_TYPES.EMAIL.WELCOME, async (job) => {
    const { userEmail, userName, templateData } = job.data;
    
    try {
        job.log(`Starting welcome email for ${userEmail}`);
        job.progress(10);
        
        // Simulate email template rendering
        job.log('Rendering email template...');
        await sleep(800);
        job.progress(30);
        
        // Simulate email validation
        job.log('Validating email address...');
        await sleep(500);
        job.progress(50);
        
        // Simulate sending email via email service (SendGrid, etc.)
        job.log('Sending email via email service...');
        await sleep(1200);
        job.progress(80);
        
        // Random failure simulation (5% chance)
        if (Math.random() < 0.05) {
            throw new Error('Email service temporarily unavailable');
        }
        
        // Simulate email delivery confirmation
        job.log('Email delivered successfully');
        job.progress(100);
        
        return {
            jobData: {
                email: userEmail,
                name: userName,
                template: templateData
            },
            status: 'delivered',
            messageId: `msg_${Date.now()}`,
            deliveredAt: new Date().toISOString()
        };
        
    } catch (error) {
        job.log(`Failed to send email: ${error.message}`);
        throw error;
    }
});

// Email verification processor
emailQueue.process(JOB_TYPES.EMAIL.VERIFICATION, async (job) => {
    const { userEmail, userName, verificationToken } = job.data;
    
    try {
        job.log(`Sending email verification to ${userEmail}`);
        job.progress(15);
        
        // Generate verification link
        const verificationLink = `https://app.example.com/verify?token=${verificationToken}`;
        job.log('Generated verification link');
        job.progress(30);
        
        // Render verification email template
        job.log('Rendering verification email template...');
        await sleep(600);
        job.progress(60);
        
        // Send verification email
        job.log('Sending verification email...');
        await sleep(900);
        job.progress(90);
        
        // Random failure simulation (3% chance)
        if (Math.random() < 0.03) {
            throw new Error('Failed to send verification email');
        }
        
        job.log('Verification email sent successfully');
        job.progress(100);
        
        return {
            jobData: {
                email: userEmail,
                name: userName,
                verificationLink
            },
            status: 'sent',
            verificationLink,
            sentAt: new Date().toISOString()
        };
        
    } catch (error) {
        job.log(`Failed to send verification email: ${error.message}`);
        throw error;
    }
});

// Newsletter email processor
emailQueue.process(JOB_TYPES.EMAIL.NEWSLETTER, async (job) => {
    const { subscribers, subject, content } = job.data;
    
    try {
        job.log(`Starting newsletter to ${subscribers.length} subscribers`);
        job.progress(5);
        
        // Process subscribers in batches
        const batchSize = 10;
        let processed = 0;
        
        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);
            
            job.log(`Processing batch ${Math.floor(i/batchSize) + 1}...`);
            await sleep(600); // Simulate batch processing time
            
            processed += batch.length;
            const progress = Math.min(95, (processed / subscribers.length) * 100);
            job.progress(progress);
        }
        
        job.log('Newsletter campaign completed');
        job.progress(100);
        
        return {
            jobData: {
                subject,
                content,
                subscribers
            },
            status: 'completed',
            totalSent: subscribers.length,
            completedAt: new Date().toISOString()
        };
        
    } catch (error) {
        job.log(`Newsletter failed: ${error.message}`);
        throw error;
    }
});
