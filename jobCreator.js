import { PRIORITY, JOB_TYPES } from "./constants.js";
import { emailQueue, smsQueue, purchaseQueue } from "./queues/index.js";

// Add realistic jobs across all queues
export async function createJobs() {
    console.log('Creating jobs across all queues...\n');
    
    // Critical priority: Login SMS
    await smsQueue.add(JOB_TYPES.SMS.LOGIN, {
        phoneNumber: '+1-555-0123',
        verificationCode: '789012',
        userName: 'alice_j'
    }, {
        priority: PRIORITY.CRITICAL,
        attempts: 5,
        backoff: 'exponential'
    });
    console.log(`📱 Queued login SMS (CRITICAL priority)`);
    
    // High priority: Email verification
    const newUsers = [
        { email: 'alice@example.com', name: 'Alice Johnson', token: 'ver_abc123' },
        { email: 'bob@example.com', name: 'Bob Smith', token: 'ver_def456' }
    ];
    
    for (const user of newUsers) {
        await emailQueue.add(JOB_TYPES.EMAIL.VERIFICATION, {
            userEmail: user.email,
            userName: user.name,
            verificationToken: user.token
        }, {
            priority: PRIORITY.HIGH,
            attempts: 4,
            backoff: 'exponential',
            delay: 1000
        });
        console.log(`🔐 Queued email verification for ${user.name} (HIGH priority)`);
    }
    
    // Medium priority: Purchase confirmations
    const purchases = [
        {
            orderId: 'ORD-001',
            customerEmail: 'customer1@example.com',
            customerName: 'John Doe',
            orderDetails: { total: 99.99, items: ['Widget A', 'Widget B'] }
        },
        {
            orderId: 'ORD-002',
            customerEmail: 'customer2@example.com',
            customerName: 'Jane Smith',
            orderDetails: { total: 149.99, items: ['Premium Widget'] }
        }
    ];
    
    for (const purchase of purchases) {
        await purchaseQueue.add(JOB_TYPES.PURCHASE.CONFIRMATION, purchase, {
            priority: PRIORITY.MEDIUM,
            attempts: 3,
            backoff: 'exponential',
            delay: 2000
        });
        console.log(`🛒 Queued purchase confirmation for ${purchase.orderId} (MEDIUM priority)`);
    }
    
    // Low priority: Welcome emails
    const welcomeUsers = [
        { email: 'alice@example.com', name: 'Alice Johnson' },
        { email: 'bob@example.com', name: 'Bob Smith' }
    ];
    
    for (const user of welcomeUsers) {
        await emailQueue.add(JOB_TYPES.EMAIL.WELCOME, {
            userEmail: user.email,
            userName: user.name,
            templateData: {
                welcomeMessage: `Welcome to our platform, ${user.name}!`,
                activationLink: `https://app.example.com/activate?token=welcome_${Date.now()}`
            }
        }, {
            priority: PRIORITY.LOW,
            attempts: 3,
            backoff: 'exponential',
            delay: 3000
        });
        console.log(`👋 Queued welcome email for ${user.name} (LOW priority)`);
    }
    
    // Bulk priority: Newsletter campaign
    const subscribers = [
        'user1@example.com', 'user2@example.com', 'user3@example.com',
        'user4@example.com', 'user5@example.com', 'user6@example.com',
        'user7@example.com', 'user8@example.com', 'user9@example.com',
        'user10@example.com'
    ];
    
    await emailQueue.add(JOB_TYPES.EMAIL.NEWSLETTER, {
        subscribers,
        subject: 'Weekly Newsletter - New Features & Updates',
        content: 'Check out our latest features and product updates...'
    }, {
        priority: PRIORITY.BULK,
        attempts: 2,
        delay: 5000
    });
    console.log(`📰 Queued newsletter for ${subscribers.length} subscribers (BULK priority)`);
}
