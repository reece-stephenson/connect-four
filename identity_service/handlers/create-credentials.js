import express from "express";
import argon from "argon2";
import User from "../model/user.js";

async function handleCreateCredentialsUsernamePassword(req, res) {
    if (typeof req.body.username !== "string" || req.body.username.length < 1) {
        return res.status(400).send("Invalid username");
    }

    // TODO - Add more email validation rules
    if (typeof req.body.email !== "string") {
        return res.status(400).send("Invalid email");
    }

    // TODO - Add more password validation rules
    if (typeof req.body.password !== "string" || req.body.password.length < 8) {
        return res.status(400).send("Password must be at least 8 characters");
    }

    const lowerCaseEmail = req.body.email.trim().toLowerCase();

    // TODO - Add salt and/or pepper to the password fields
    const hash = await argon.hash(req.body.password);
    const username = req.body.username.trim();
    const lowerCaseUsername = username.toLowerCase();

    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: lowerCaseEmail });
    if (oldUser) {
        return res.status(400).send("Invalid username");
    }

    // Create identifier scoped to our host
    await User.create({
        email: lowerCaseEmail, // sanitize: convert email to lowercase
        username: lowerCaseUsername,
        password: hash,
    });

    return res.status(201).json({
        email: lowerCaseEmail
    });
}

function handleCreateCredentialsRoute(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    // In future articles we're going to add new credential types! So lets prepare for that using a switch here
    switch (req.body.type) {
        case "username-password": return handleCreateCredentialsUsernamePassword(req, res).catch(next);
        default: res.sendStatus(400);
    }
}

// express allows a "handler" to be an array, as it will flatten out the 
// list of handlers and invoke them in serial
export default [
    // Parse our body as json
    express.json(),
    handleCreateCredentialsRoute
];