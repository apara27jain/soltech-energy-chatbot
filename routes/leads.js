const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// POST /api/leads - save a new lead submitted from the chatbot
router.post("/", async (req, res) => {
    try {
        const { name, phone, company, pincode, monthly_bill, action_context, language } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ error: "Name and phone are required." });
        }

        const lead = await Lead.create({
            name,
            phone,
            company,
            pincode,
            monthly_bill,
            action_context,
            language
        });

        res.status(201).json({ success: true, lead });
    } catch (err) {
        console.error("Error saving lead:", err);
        res.status(500).json({ error: "Failed to save lead." });
    }
});

// GET /api/leads - list saved leads, most recent first
router.get("/", async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json({ success: true, count: leads.length, leads });
    } catch (err) {
        console.error("Error fetching leads:", err);
        res.status(500).json({ error: "Failed to fetch leads." });
    }
});

module.exports = router;
