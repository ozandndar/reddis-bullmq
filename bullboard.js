import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import { ENV } from "./constants.js";
import { emailQueue, smsQueue, purchaseQueue } from "./queues/index.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const queues = [emailQueue, smsQueue, purchaseQueue]
    .map((queue) => new BullAdapter(queue));


const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues,
    serverAdapter,
});

const app = express();

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(ENV.PORT, () => {
    console.log(`🎛️  Bull Board server started on port ${ENV.PORT}`);
    console.log(`📊 Dashboard available at: http://localhost:${ENV.PORT}/admin/queues`);
    console.log(`📋 Monitoring queues: email-queue, sms-queue, purchase-queue`);
});