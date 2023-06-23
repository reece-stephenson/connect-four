import JSONWebToken from "jsonwebtoken";
import bearerToken from "express-bearer-token";
import Token from "../model/token.js";

async function verify(req, res, next) {
    if (!req.token) {
        // No token, no pass
        return res.sendStatus(401);
    }
    // Decode our token so we can 
    const decoded = JSONWebToken.decode(req.token, { complete: true });
    if (!decoded || !decoded.header.kid) {
        // No kid, no pass, we didn't generate this
        return res.sendStatus(401);
    }

    const verifiedToken = await Token.findOne({ jwtKey: decoded.header.kid });

    if (!verifiedToken) {
        // No token, no pass
        return res.sendStatus(401);
    }

    if (!(verifiedToken && verifiedToken.algorithm && verifiedToken.publicKey)) {
        // No key information to compare to
        return res.sendStatus(401);
    }

    const verified = await new Promise(
        resolve => JSONWebToken.verify(
            req.token,
            verifiedToken.publicKey,
            {
                algorithms: [
                    // Only allow the one that was stored with the key 
                    verifiedToken.algorithm
                ]
            },
            (error, verified) => resolve(error ? undefined : verified)
        )
    );
    if (!verified) {
        // Not valid 
        return res.sendStatus(401);
    }
    // Add our identity to the req, use `user` here as thats pretty standard
    req.user = {
        id: verified.sub
    };
    // Ready to rol;
    next(undefined);
}

function handler(req, res, next) {
    verify(req, res, next)
        .catch(next);
}

export default [
    bearerToken(),
    handler
];
