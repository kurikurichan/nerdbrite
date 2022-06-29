const express = require('express');
const asyncHandler = require('express-async-handler');
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

const { requireAuth } = require("../../utils/auth");
const db = require('../../db/models');
const user = require('../../db/models/user');

const router = express.Router();

// TODO: make registration validator
const ticketValidator = [
    handleValidationErrors
]

// GET registration form
// Put in modal
router.get('/', asyncHandler(async (req, res) => {
    const tickets = await db.Ticket.findAll();
    return res.json(ticket);
}));

// GET list of all registrations for a user
// visible only by the user
router.get('/:userId', requireAuth, handleValidationErrors, asyncHandler(async (req, res) => {
    const tickets = await db.Ticket.findAll({
        where: {
            id: req.params.userId
        }
    });
    return res.json(tickets);
}));

// POST registration - create new registration
router.post('/', requireAuth, handleValidationErrors, asyncHandler(async (req, res) => {

    const { eventId, userId } = req.body;

    const newReg = await db.Ticket.create({
        eventId,
        userId
    });

    res.status(201);
    return res.json(newReg);
}));

// DELETE registration
router.delete('/:id(\\d+)', requireAuth, handleValidationErrors, asyncHandler(async (req, res) => {

    const regToDelete = await db.Ticket.findByPk(req.params.id);

    if (regToDelete && req.user.id === regToDelete.userId) {
        await regToDelete.destroy();
        res.status(204).end(); // maybe change later idk
    }
    else throw new Error('Unauthorized');
    res.status(401).end();
}));

module.exports = router;
