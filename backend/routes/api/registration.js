const express = require('express');
const asyncHandler = require('express-async-handler');
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

const { requireAuth } = require("../../utils/auth");
const db = require('../../db/models');

const router = express.Router();

const ticketValidator = [
    check("eventId")
        .exists("Need an event to register for"),
    check("userId")
        .exists("Must be a logged in user to register for event"),
    handleValidationErrors
]

// GET registration form
// Put in modal
router.get('/', asyncHandler(async (req, res) => {
    const tickets = await db.Ticket.findAll();
    return res.json(tickets);
}));

// GET list of all registrations for a user
// visible only by the user
router.get('/:userId', requireAuth, asyncHandler(async (req, res, next) => {

    if (req.params.userId == req.user.id) {
        const tickets = await db.Ticket.findAll({
            where: {
                userId: req.params.userId
            },
            include: [{
                model: db.Event,
                attributes: ['id', 'name']
            }]
        });

        return res.json(tickets);

    } else {
        const err = new Error('Forbidden Content');
        err.status = 403;
        err.title = 'Forbidden';
        err.errors = ["Cannot view another user's events"];
        return next(err);
    }
}));

// GET one registration (for checking if user has a ticket on single event page)
router.get('/:eventId/ticket', requireAuth, asyncHandler(async (req, res) => {

    const eventId = req.params.eventId;

    currentUserTicket = await db.Ticket.findOne({
        where: {
            eventId,
            userId: req.user.id
        },
        include: [{
            model: db.Event,
            attributes: ['id', 'name']
        }]
    });
    // should return null or a ticket object
    return res.json(currentUserTicket);
}));

// POST registration - create new registration
router.post('/', requireAuth, ticketValidator, asyncHandler(async (req, res, next) => {

    const { eventId, userId } = req.body;

    const newReg = await db.Ticket.create({
        eventId,
        userId
    });

    return res.json(newReg);


}));

// DELETE registration
router.delete('/:regId(\\d+)', requireAuth, asyncHandler(async (req, res) => {

    const regToDelete = await db.Ticket.findByPk(+req.params.regId);

    console.log("req: ", typeof req.user.id);
    console.log("regToDelete: ", regToDelete);
    console.log("regToDelete.userId", regToDelete.userId, typeof regToDelete.userId);
    if (regToDelete && req.user.id === regToDelete.userId) {
        await regToDelete.destroy();
        res.status(204).json({"message": "success"})
    }
    else res.json({"message": "failure"});
}));

module.exports = router;
