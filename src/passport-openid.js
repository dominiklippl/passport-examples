const passport = require("passport");
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;
passport.serializeUser(function (user, callback) {
    console.log("[OPEN-ID] Serialize user, user: ", user);
    callback(null, {id: user.id, username: user.username, name: user.displayName});
});

passport.deserializeUser(function (user, callback) {
    console.log("[OPEN-ID] Deserialize user, user: ", user);
    callback(null, user);
});

passport.use("openid-strategy", new OpenIDConnectStrategy({
        issuer: process.env.ISSUER,
        authorizationURL: process.env.AUTHORIZATION_URL,
        tokenURL: process.env.TOKEN_URL,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        userInfoURL: process.env.USER_INFO_URL,
        callbackURL: `http://localhost:${process.env.PORT}/openid/callback`,
        scope: ['profile', 'email'],
        profile: true
    },
    function verify(issuer, profile, callback) {
        console.log(`[OPEN-ID] Verify, issuer: ${issuer}, profile: ${profile}`);
        return callback(null, profile);
    }
));