module.exports = (app, passport) => {
    app.get('/signup', (req, res) => {
        res.render('signup.ejs', {message: req.flash('signupMessage')})
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile/local',
        failureRedirect: '/signup',
        failureFlash: true
    }))
}