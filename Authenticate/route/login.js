module.exports = (app, passport) => {
    app.get('/login', (req, res) => {
        res.render('login.ejs', { message: req.flash('loginMessage') })
    })
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile/local',
        failureRedirect: '/login',
        failureflash: true
    }))

    app.get('/profile/local', isLoggedIn, (req, res) => {
        
        res.render('profile.ejs', {
            user: req.user[0]
        })
    })

    app.get('/profile/facebook', isLoggedIn, (req, res) => {
        
        res.render('profileFacebook.ejs', {
            user: req.user[0]
        })
    })

    app.get('/profile/google', isLoggedIn, (req, res) => {
        
        res.render('profileGoogle.ejs', {
            user: req.user[0]
        })
    })

    app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
            return next();
        else 
            res.redirect('/') 
    }
};