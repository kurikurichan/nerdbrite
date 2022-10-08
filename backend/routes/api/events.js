const express = require('express');
const asyncHandler = require('express-async-handler');
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { singlePublicFileUpload, singleMulterUpload } = require("../../awsS3");

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
        .custom(date => {
            // Note: can just compare date objects with < or >
            let newDate = fixDate(new Date(date));
            let today = fixDate(Date.now());
            if (newDate < today) {
                throw new Error("Selected date cannot be in the past")
            }
            return true;
        })
        .custom(date => {
            // 86400 is 1 day in seconds
            let newDate = fixDate(new Date(date));
            const today = fixDate(Date.now());
            const timeDifference = (newDate.getTime() / 1000) - (today.getTime() / 1000);
            if (timeDifference < 86400 && timeDifference >= 0) {
                throw new Error("Event cannot start today")
            }
            return true;
        }),
    check("venueName")
        .exists({ checkFalsy: true })
        .withMessage("Venue name is required")
        .isLength({ max: 75 })
        .withMessage("Venue name cannot be longer than 75 characters"),
    check("capacity")
        .custom(val => {
            val = +val;
            if (typeof val !== "number") throw new Error("Capacity must be a number")
            else if (val >= 0) return true;
            else if (val > 1000000) throw new Error("Cannot have more than 1 million guests")
            else throw new Error("Capacity cannot be less than 0");
        }),
    check("description")
        .exists({ checkFalsy: true})
        .withMessage("Please provide a description"),
    // check("image")
    //     .custom(url => {
    //         if (url.length > 0) {
    //             let extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    //             for (let format of extensions) {
    //                 if (url.endsWith(format)) return true;
    //             }
    //             throw new Error("Image must be of type .jpg, .jpeg, .png, .gif, or type .bmp");
    //         }
    //         return true; // return true here in case url was not provided
    //     }),
    handleValidationErrors
];

const editEventValidator = [
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
            let newDate = fixDate(new Date(date));
            let today = fixDate(Date.now());
            if (newDate < today) {
                throw new Error("Selected date cannot be in the past")
            }
            return true;
        }),
    check("venueName")
        .exists({ checkFalsy: true })
        .withMessage("Venue name is required")
        .isLength({ max: 75 })
        .withMessage("Venue name cannot be longer than 75 characters"),
    check("capacity")
        .custom(val => {
            val = +val;
            if (typeof val !== "number") throw new Error("Capacity must be a number")
            else if (val >= 0) return true;
            else if (val > 1000000) throw new Error("Cannot have more than 1 million guests")
            else throw new Error("Capacity cannot be less than 0");
        }),
    check("description")
        .exists({ checkFalsy: true})
        .withMessage("Please provide a description"),
    // check("image")
    //     .custom(url => {
    //         if (url.length > 0) {
    //             let extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    //             for (let format of extensions) {
    //                 if (url.endsWith(format)) return true;
    //             }
    //             throw new Error("Image must be of type .jpg, .jpeg, .png, .gif, or type .bmp");
    //         }
    //         return true; // return true here in case url was not provided
    //     }),
    handleValidationErrors
];

// dates are coming back as 1 day behind than they are supposed to ~.~
function fixDate(date) {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate;
}

// GET events
router.get('/', asyncHandler(async (req, res) => {
    const events = await db.Event.findAll({
        include: [{
            model: db.User, // Note: THIS is the Creator user, not necessarily the current user
            attributes: ['id','username']
        }],
        raw: true,
        nest: true
    });
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

    const categories = await db.Category.findAll();

    return res.json(categories);
}));

// POST a new event
router.post('/', requireAuth, singleMulterUpload("image"), eventValidator, asyncHandler(async (req, res) => {

    const { hostId, category, name, date, capacity, description, venueName, address, lat, lng  } = req.body;

    console.log("------------", req.body);
    let image;
    if (req.file) image = await singlePublicFileUpload(req.file);

    const categoryId = await db.Category.findOne({
        where: { type: category }
    });

    const newEvent = await db.Event.create({
        hostId,
        categoryId: categoryId.id,
        name,
        date: fixDate(date),
        capacity,
        image,
        description,
        venueName,
        address,
        lat,
        lng
    });

    res.status(201);
    return res.json(newEvent);

}));

// PUT, edit event form
router.put('/:id(\\d+)', requireAuth, singleMulterUpload("image"), editEventValidator, asyncHandler(async (req, res) => {


    const { hostId, category, name, date, capacity, description, venueName, address, lat, lng } = req.body;
    const id = req.params.id;

    // Find the event to edit
    const eventToEdit = await db.Event.findByPk(id);

    const categoryId = await db.Category.findOne({
        where: { type: category }
    });

    let updatedEvent;

    // basically if someone doesn't upload a pic again, reload the old pic
    let image;
    if (req.file) image = await singlePublicFileUpload(req.file);
    else image = eventToEdit.image;

    if (eventToEdit && req.user.id === eventToEdit.hostId) { // verify that user is editing their own event
        updatedEvent = await eventToEdit.update({
            hostId,
            categoryId: categoryId.id,
            name,
            date: fixDate(date),
            capacity,
            image,
            description,
            venueName,
            address,
            lat,
            lng
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

router.get('/mapKey', asyncHandler(async (req, res) => {
    return res.json(process.env.MAPS_KEY);
}));



module.exports = router;
