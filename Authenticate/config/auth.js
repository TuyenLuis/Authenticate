module.exports = {
    facebookAuth : {
        clientID: "302047650572497",
        clientSecret: "2a7f7551f1508e167ed633417abe132a",
        callbackURL: "http://localhost:6969/auth/facebook/cb",
        profilefields: ['id', 'email', 'displayName']
    },
    googleAuth : {
        clientID     : '499447151912-euoeb2jan608m3o7nb1hdse21904h09r.apps.googleusercontent.com',
        clientSecret  : 'JWXR4NjJLw22Zikh_Ep5rvNC',
        callbackURL   : 'http://localhost:6969/auth/google/cb'
    }
}