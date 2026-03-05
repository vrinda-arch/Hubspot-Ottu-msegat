import crypto from "crypto";

export function verifyOttuSignature(req, res, next) {
  const VERIFY_SIGNATURE =
    process.env.VERIFY_OTTU_SIGNATURE === "true";

  if (!VERIFY_SIGNATURE) {
    return next();
  }

  try {
    const receivedSignature = req.body.signature;

    if (!receivedSignature) {
      return res.status(400).send("Missing signature");
    }

    const payload = { ...req.body };
    delete payload.signature;

    const computedSignature = crypto
      .createHmac("sha256", process.env.OTTU_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (computedSignature !== receivedSignature) {
      return res.status(401).send("Invalid signature");
    }

    next();
  } catch (err) {
    return res.status(500).send("Verification error");
  }
}
