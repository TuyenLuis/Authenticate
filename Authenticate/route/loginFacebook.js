module.exports = (app, passport) => {
    app.get('/auth/facebook', passport.authenticate('facebook', { 
        scope : ['public_profile', 'email']
    }));
    app.get('/auth/facebook/cb', passport.authenticate('facebook', {
        successRedirect : '/profile/facebook',
        failureRedirect : '/'
    }));
}