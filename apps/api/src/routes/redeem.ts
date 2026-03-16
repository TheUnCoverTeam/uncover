// POST /api/billing/redeem — redeem a promo code
// Add this route to apps/api/src/routes/stripe.ts before the webhook route

import { Router, Request, Response } from "express";
import { apiKeyAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import prisma from "../lib/db.js";

const router = Router();

router.post("/redeem", apiKeyAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code } = req.body as { code?: string };
    if (!code?.trim()) {
      return res.status(400).json({ error: "Promo code required" });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: { redemptions: { where: { userId: req.userId! } } },
    });

    if (!promo) {
      return res.status(404).json({ error: "Invalid promo code" });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(410).json({ error: "This promo code has expired" });
    }

    if (promo.usedCount >= promo.maxUses) {
      return res.status(410).json({ error: "This promo code has already been fully redeemed" });
    }

    if (promo.redemptions.length > 0) {
      return res.status(409).json({ error: "You have already redeemed this code" });
    }

    // Redeem atomically
    await prisma.$transaction([
      prisma.promoCode.update({
        where: { id: promo.id },
        data: { usedCount: { increment: 1 } },
      }),
      prisma.promoRedemption.create({
        data: { promoId: promo.id, userId: req.userId! },
      }),
      prisma.billing.update({
        where: { userId: req.userId! },
        data: { credits: { increment: promo.credits } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: req.userId!,
          type: "promo",
          credits: promo.credits,
          amountCents: 0,
          description: `Promo code redeemed: ${promo.code}`,
        },
      }),
    ]);

    return res.json({
      success: true,
      credits: promo.credits,
      message: `${promo.credits} credits added to your account`,
    });
  } catch (err) {
    console.error("[billing] redeem error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
