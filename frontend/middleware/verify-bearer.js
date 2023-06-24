import JSONWebToken from "jsonwebtoken";
import bearerToken from "express-bearer-token";
import Token from "../model/token.js";

async function verify(req, res, next) {
    let url = '/'
    if (!req.cookies.token) {
        // No token, no pass
        return res.redirect(url);
    }
    // Decode our token so we can 
    const decoded = JSONWebToken.decode(req.cookies.token, { complete: true });
    if (!decoded || !decoded.header.kid) {
        // No kid, no pass, we didn't generate this
        return res.redirect(url);
    }

    const verifiedToken = await Token.findOne({ jwtKey: decoded.header.kid });

    if (!verifiedToken) {
        // No token, no pass
        return res.redirect(url);
    }

    if (!(verifiedToken && verifiedToken.algorithm && verifiedToken.publicKey)) {
        // No key information to compare to
        return res.redirect(url);
    }

    const verified = await new Promise(
        resolve => JSONWebToken.verify(
            req.cookies.token,
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
        return res.redirect(url);
    }
    // Add our identity to the req, use `user` here as thats pretty standard
    req.user = {
        id: verified.sub
    };
    // Ready to rol;
    next();
}

function handler(req, res, next) {
    verify(req, res, next)
        .catch(next);
}

export default [
    bearerToken(),
    handler
];
