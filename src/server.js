function serve() {
    require('dotenv').config();

    const express = require('express');
    const passport = require('passport');
    const cookieSession = require('cookie-session');
    require('./passport-openid');

    const app = express();

    const isLoggedIn = (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    // 1. initialize
    app.use(cookieSession({
        secret: 'somethingsecretgoeshere',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: true}
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    // 2. "register" express routes
    app.get("/", (req, res) => {
        res.json({message: "You are not logged in"})
    });

    app.get("/failed", (req, res) => {
        res.send("Failed")
    });

    app.get("/success", isLoggedIn, (req, res) => {
        res.send(`Welcome ${req.user.name}`)
    });

    app.get("/logout", (req, res) => {
        req.session = null;
        req.logout();
        res.redirect('/');
    })

    // OAUTH-2 ROUTES
    app.get('/oauth2',
        passport.authenticate('oauth2-strategy', {
                scope: ['email', 'profile']
            }
        )
    );

    app.get('/oauth2/callback',
        passport.authenticate('oauth2-strategy', {
            failureRedirect: '/failed',
            failureMessage: true
        }),
        (req, res) => {
            res.redirect('/');
        }
    );


    // OPEN-ID ROUTES
    app.get('/openid', passport.authenticate('openid-strategy'));

    app.get('/openid/callback',
        passport.authenticate('openid-strategy', {
            failureRedirect: '/failed',
            failureMessage: true
        }),
        (req, res) => {
            res.redirect('/');
        }
    );

    // 3. start server
    const PORT = process.env.PORT ?? 5000;
    app.listen(PORT, () => {
        console.log(`[SERVER] Server is up and running at the port ${PORT}`);
    });
}

serve();