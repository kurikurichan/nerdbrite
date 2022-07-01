const express = require('express');
const asyncHandler = require('express-async-handler');
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

const { requireAuth } = require("../../utils/auth");
const db = require('../../db/models');
;

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
        .custom(date => {
            // Note: can just compare date objects with < or >
            date = new Date(date);
            if (date.getTime() < Date.now()) {
                throw new Error("Selected date cannot be in the past")
            }
            return true;
        })
        .custom(date => {
            date = new Date(date)
            if ((date.getTime() / 1000) - (Date.now() / 1000) < 86400) {
                throw new Error("Event cannot start within 24 hours")
            }
            return true;
        }),
    // check("categoryId")
    //     .exists({ checkFalsy: true })
    //     .withMessage("Please select a category"),
    check("capacity")
        .custom(val => val >= 0)
        .withMessage("Capacity cannot be less than 0"),
    handleValidationErrors
];

// GET events
router.get('/', asyncHandler(async (req, res) => {
    const events = await db.Event.findAll();
    return res.json(events);
}));

// GET one event
router.get('/:eventId(\\d+)', asyncHandler(async (req, res) => {

    /*
    Find ONE event, for the single event page
    IF the user is registered for this event, they should have a ticket already.
    Right now if the user CREATED this event, it shows them as having a ticket for it.
    */
    const eventId = req.params.eventId;
    const event = await db.Event.findByPk(+eventId, {
        include: [{
            model: db.User, // Note: THIS is the Creator user, not necessarily the current user
            attributes: ['id','username']
        },
        {
            model: db.Venue,
            attributes: ['name']
        },
        {
            model: db.Category,
            attributes: ['type']
        }],
        raw: true,
        nest: true
    });

    if (event) {
        return res.json(event);
    } else { // if event ID is invalid
        res.status(404).json("Event not found");
    }
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

// GET edit event form
router.get('/:id(\\d+)/edit', asyncHandler(async (req, res) => {
    // need to send these to front end:
    // - categories for the dropdown list
    // - venues for the dropdown list - FOR NOW - eventually should be replaced

    // find the specific event to edit
    const id = req.params.id;
    const eventToEdit = await db.Event.findByPk(id);

    // Find & format the info for the form dropdowns
    const venues = await db.Venue.findAll({
        attributes: ["id", "name"]
    });
    const categories = await db.Category.findAll();

    const dataNeededForEditForm = {};

    dataNeededForEditForm.venues = venues;
    dataNeededForEditForm.categories = categories;
    dataNeededForEditForm.eventData = eventToEdit;

    if (eventToEdit && req.user.id === eventToEdit.hostId) { // do not give the frontend the info if this isn't the user's own event
        return res.json(dataNeededForEditForm);
    } else throw new Error("Not authorized to edit this event");

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

// PUT, edit event form
router.put('/:id(\\d+)', requireAuth, eventValidator, asyncHandler(async (req, res) => {

    const { hostId, venue, category, name, date, capacity } = req.body;
    const id = req.params.id;

    // Find the event to edit
    const eventToEdit = await db.Event.findByPk(id);

    const venueId = await db.Venue.findOne({
        where: { name: venue }
    });

    const categoryId = await db.Category.findOne({
        where: { type: category }
    });

    let updatedEvent;

    if (eventToEdit && req.user.id === eventToEdit.hostId) { // verify that user is editing their own event
        updatedEvent = await eventToEdit.update({
            hostId,
            venueId: venueId.id,
            categoryId: categoryId.id,
            name,
            date: new Date(date),
            capacity
        });

        await updatedEvent.save();
        res.status(201);
        return res.json(updatedEvent);
    }
    else {
        res.json("failure in update event");
    }

}));

// DELETE, delete specific event
router.delete('/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {

    const id = req.params.id;
    // find the thing to delete, verify it's in database
    const eventToDelete = await db.Event.findByPk(id);
    const copyOfEvent = eventToDelete;

    if (!eventToDelete) throw new Error('Event not found');

    if (req.user.id === eventToDelete.hostId) {
        res.status(204);
        res.json(copyOfEvent); // do I need a res.json??? some kind of message to the front end?
        await eventToDelete.destroy();
    }
    else res.json("Unauthorized");

}));



module.exports = router;
