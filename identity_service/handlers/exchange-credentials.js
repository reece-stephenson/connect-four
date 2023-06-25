import express from "express";
import argon from "argon2";
import User from "../model/user.js";
import Token from "../model/token.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UUID from "pure-uuid";

async function getIdentityForEmailPasswordCredentials(req, res) {
    if (typeof req.body.email !== "string" || req.body.email.length < 1) {
        return res.status(400).send({ message: "Email not provided" });
    }

    if (typeof req.body.password !== "string" || req.body.password.length < 1) {
        return res.status(400).send({ message: "Password not provided" });
    }

    const lowerCaseEmail = req.body.email.trim().toLowerCase();
    const userInfo = await User.findOne({ email: lowerCaseEmail });

    if (!(userInfo && userInfo.password && userInfo.id)) {
        res.sendStatus(401);
        // Already handled
        return undefined;
    }

    let userSalt = userInfo.salt;

    const match = await argon.verify(userInfo.password, req.body.password + userSalt);
    if (!match) {
        res.sendStatus(401);
        // Already handled
        return undefined;
    }
    return userInfo.id;
}

async function getIdentityForCredentials(req, res) {
    switch (req.body.from) {
        case "username-password": return getIdentityForEmailPasswordCredentials(req, res);
        default: res.sendStatus(400);
    }
}

async function createKeyPair() {
    return new Promise(
        (resolve, reject) => crypto.generateKeyPair(
            'rsa',
            {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: "spki",
                    format: "pem"
                },
                privateKeyEncoding: {
                    type: "pkcs8",
                    format: "pem"
                }
            },
            (error, publicKey, privateKey) => error ? reject(error) : resolve({ publicKey, privateKey })
        )
    );
}

async function generateBearerTokenCredentials(req, res, identity) {
    const { publicKey, privateKey } = await createKeyPair();
    const expiresAtInMS = Date.now() + 300000;
    const payload = {
        sub: identity,
        // exp is in **seconds**, not milliseconds
        // Floor so that we have an integer
        exp: Math.floor(expiresAtInMS / 1000)
    };

    const keyid = new UUID(4).format();
    const algorithm = "RS256";
    const token = await new Promise(
        (resolve, reject) => jwt.sign(
            payload,
            privateKey,
            {
                algorithm,
                keyid
            },
            (error, token) => error ? reject(error) : resolve(token)
        )
    );

    try {
        await Token.create({
            jwtKey: keyid,
            algorithm: algorithm,
            publicKey: publicKey,
            expireAt: expiresAtInMS
        });

    } catch (error) {
        return res.sendStatus(500);
    }

    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true })

    res.sendStatus(200);
}

async function generateCredentials(req, res, identity) {
    switch (req.body.to) {
        case "bearer": return generateBearerTokenCredentials(req, res, identity);
        default: res.sendStatus(400);
    }
}

function handleExchangeCredentialsRoute(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    getIdentityForCredentials(req, res)
        .then(identity => {
            if (!identity) {
                // Already handled
                return;
            };
            return generateCredentials(req, res, identity);
        })
        .catch(next);
}

// express allows a "handler" to be an array, as it will flatten out the 
// list of handlers and invoke them in serial
export default [
    // Parse our body as json
    express.json(),
    handleExchangeCredentialsRoute
];
