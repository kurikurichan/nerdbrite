const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const db = require('../../db/models');


// GET events
router.get('/', asyncHandler(async (req, res) => {
    const events = await db.Event.findAll();
    return res.json(events);
}));

// POST a new event
router.post('/', asyncHandler(async (req, res) => {
    const { hostId, venueId, categoryId, name, date, capacity } = req.body;
    const newEvent = await db.Event.build({
        hostId,
        venueId,
        categoryId,
        name,
        date,
        capacity
    });

    if (newEvent) {
        await newEvent.save();
        return res.json(newEvent);
    }
}));

module.exports = router;
