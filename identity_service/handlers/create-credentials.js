import express from "express";
import argon from "argon2";
import crypto from "crypto";
import User from "../model/user.js";

function checkUsername(username) {
    if (typeof username !== "string") {
        return "Username not string";
    }

    if (username.length < 1) {
        return "Username too short";
    }

    return "Valid";
}

async function checkEmail(email) {
    if (typeof email !== "string") {
        return "Email not string";
    }

    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validEmailRegex)) {
        return "Invalid Email";
    }

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
        return "Email already exists";
    }

    return "Valid";
}

function checkPassword(password) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (password.length < 8) {
        return "Password length must be at least 8";
    }

    if (typeof password !== "string") {
        return "Password format invalid";
    }

    if (!specialChars.test(password)) {
        return "Password must contain at least 1 special character";
    }

    if (!(/[A-Z]/.test(password))) {
        return "Password must contain at least 1 upper case letter";
    }

    if (!(/[a-z]/.test(password))) {
        return "Password must contain at least 1 lower case letter";
    }

    return "Valid";
}

async function hashPassword(password, salt) {
    return argon.hash(password + salt);
}

async function handleCreateCredentialsUsernamePassword(req, res, next) {
    let username = req.body.username;
    let usernameResult = checkUsername(username);
    if (usernameResult != "Valid") {
        return res.status(400).send({ message: usernameResult });
    }

    const lowerCaseEmail = req.body.email.trim().toLowerCase();
    let emailResult = await checkEmail(lowerCaseEmail);
    if (emailResult != "Valid") {
        return res.status(400).send({ message: emailResult });
    }

    const password = req.body.password;
    let passwordResult = checkPassword(password);
    if (passwordResult != "Valid") {
        return res.status(400).send({ message: passwordResult });
    }

    let salt = crypto.randomBytes(16).toString('base64');
    const hash = await hashPassword(password, salt);
    username = username.trim();
    const lowerCaseUsername = username.toLowerCase();

    try {
        await User.create({
            email: lowerCaseEmail,
            username: lowerCaseUsername,
            password: hash,
            salt: salt
        });
    } catch (error) {
        return res.sendStatus(500);
    }

    return res.status(201).json({
        email: lowerCaseEmail
    });
}

function handleCreateCredentialsRoute(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    switch (req.body.type) {
        case "username-password":
            return handleCreateCredentialsUsernamePassword(req, res).catch(next);
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
