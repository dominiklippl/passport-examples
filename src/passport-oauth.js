const passport = require("passport");
const OAuth2Strategy = require('passport-oauth2').Strategy;

passport.serializeUser(function (user, callback) {
    console.log("[OAUTH2] Serialize user, user: ", user);
    callback(null, user);
});

passport.deserializeUser(function (user, callback) {
    console.log("[OAUTH2] Deserialize user, user: ", user);
    callback(null, user);
});

const oauth2Client = new OAuth2Strategy({
        authorizationURL: process.env.AUTHORIZATION_URL,
        tokenURL: process.env.TOKEN_URL,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        userInfoURL: process.env.USER_INFO_URL,
        callbackURL: `http://localhost:${process.env.PORT}/oauth2/callback`,
        passReqToCallback: true
    },
    function (request, accessToken, refreshToken, profile, done) {
        console.log(`[OAUTH2] Verify, accessToken: ${accessToken}, \n refreshToken: ${refreshToken}, \n profile: ${profile}`);
        return done(null, profile);
    }
);

oauth2Client.userProfile = function (accessToken, done) {
    console.log(`[OAUTH2] User profile: ${accessToken}`);
    done()
};

passport.use("oauth2-strategy", oauth2Client);