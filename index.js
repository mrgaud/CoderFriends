const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const keys = require('./keys');
const app = express()

var requireAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(403).end();
  }
  return next();
}
var GitHubApi = require('node-github')

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
    }
})
app.get('/api/github/following',requireAuth, function(req, res) {
    github.user.getFollowingFromUser({
        user: session.user.username
    }, function(err, result) {
        console.log(result)
        res.send(result)
    })
})

passport.use(new GitHubStrategy({
        clientID: keys.id,
        clientSecret: keys.clientSecret,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        session.user = profile;
        console.log(session.user);
        return done(null, profile);
    }
));




app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('./public'))

app.use(bodyParser.json())
app.use(session({
    secret:'keyboard cat'
}))
app.use(cors())


app.get('/auth/github', passport.authenticate('github'))

app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/#!/home',
    failureRedirect: '/'
}))
app.get('/user', function(req, res) {
    console.log(req);
    res.send(session.user)
})
// app.get('/followers/:id',requireAuth , function(req,res){
// res.send(`https://api.github.com/users/${req.params.id}/followers`)
// })

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});





app.listen(3000)
