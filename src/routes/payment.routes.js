import express from "express";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/generate-payment", paymentController.generatePayment);
router.post("/ottu-webhook", paymentController.handleOttuWebhook);

export default router;
