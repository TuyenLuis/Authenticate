module.exports = (app, passport) => {
    app.get('/auth/google', passport.authenticate('google',{ 
        scope : ['profile', 'email']
    }));
    app.get('/auth/google/cb', passport.authenticate('google', {
        successRedirect: '/profile/google',
        failureRedirect: '/'
    }))
}