const express = require('express');
const asyncHandler = require('express-async-handler');
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

const { requireAuth } = require("../../utils/auth");
const db = require('../../db/models');

const router = express.Router();

const eventValidator = [
    // TODO: verify that date error handling works
    check("name") // note: later add a min length to this?
        .exists({ checkFalsy: true })
        .withMessage("Event requires a name")
        .isLength({ max: 100 })
        .withMessage("Event name cannot be longer than 100 characters"),
    check("date")
        .exists({ checkFalsy: true })
        .withMessage("A date is required")
        .custom(date => date.getTime() > Date.now())
        .withMessage("Selected date cannot be in the past")
        .custom(date => (date.getTime() / 1000) - (Date.now() / 1000) >= 86400)
        .withMessage("Event cannot start within 24 hours"),
    check("categoryId")
        .exists({ checkFalsy: true })
        .withMessage("Please select a category"),
    check("capacity")
        .custom(val => val >= 0)
        .withMessage("Capacity cannot be less than 0"),
    handleValidationErrors
];
(t.getTime() / 1000) - (Date.now() / 1000) >= 86400


// GET events
router.get('/', asyncHandler(async (req, res) => {
    const events = await db.Event.findAll();
    return res.json(events);
}));

// GET new event form
router.get('/new', asyncHandler(async (req, res) => {
    // need to send these to front end:
    // - categories for the dropdown list
    // - venues for the dropdown list
    // Venues should be found via google maps tbh but will have a dropdown for now
    // Venues should also be able to be created. That is TBD

    const venues = await db.Venue.findAll({
        attributes: ["id", "name"]
    });
    const categories = await db.Category.findAll();

    const venuesAndCategories = {};

    venuesAndCategories.venues = venues;
    venuesAndCategories.categories = categories;

    return res.json(venuesAndCategories);
}));


// POST a new event
router.post('/', requireAuth, eventValidator, asyncHandler(async (req, res) => {

    const { hostId, venue, category, name, date, capacity } = req.body;

    const venueId = await db.Venue.findOne({
        where: { name: venue }
    });

    const categoryId = await db.Category.findOne({
        where: { type: category }
    });


    // TODO: fix so that newEvent is getting the
    const newEvent = await db.Event.create({
        hostId,
        venueId: venueId.id,
        categoryId: categoryId.id,
        name,
        date: new Date(date),
        capacity
    });

    res.status(201);
    return res.json(newEvent);

}));

module.exports = router;
