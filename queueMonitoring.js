// Event handlers for monitoring all queues
export function setupQueueMonitoring(queues) {
    const queueNames = ['Email', 'SMS', 'Purchase'];
    
    queues.forEach((queue, index) => {
        const queueName = queueNames[index];
        
        queue.on('completed', (job, result) => {
            console.log(`✅ ${queueName} job ${job.id} (${job.name}) completed successfully`);
            console.log(`   Result: ${JSON.stringify(result)}`);
        });

        queue.on('failed', (job, error) => {
            console.log(`❌ ${queueName} job ${job.id} (${job.name}) failed: ${error.message}`);
        });

        queue.on('active', (job) => {
            console.log(`🔄 Processing ${queueName.toLowerCase()} job ${job.id} (${job.name})`);
        });

        queue.on('stalled', (job) => {
            console.log(`⚠️  ${queueName} job ${job.id} (${job.name}) stalled`);
        });

        queue.on('waiting', (job) => {
            console.log(`⏳ ${queueName} job ${job.id} (${job.name}) waiting`);
        });
    });
}

// Graceful shutdown utility
export async function gracefulShutdown(queues) {
    console.log('\nShutting down');
    
    await Promise.all(queues.map(queue => queue.close()));
    
    console.log('All queues closed');
    process.exit(0);
}
