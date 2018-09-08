const LocalStragy = require('passport-local').Strategy;
const FacebookStragy = require('passport-facebook').Strategy;
const GoogleStragy = require('passport-google-oauth').OAuth2Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');

const Config = require('../config/auth');


let con = require('./database')(mysql);

module.exports = (passport) => {

    //#region serialize and deserialize 
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        
        
        con.query(`SELECT * FROM facebook WHERE id = '${id}'`, (err, user) => {
            if(user.length > 0){
                done(err, user);
            }
            else{
                con.query(`SELECT * FROM local WHERE id = '${id}'`, (err, user) => {
                    if(user.length > 0){
                        done(err, user);
                    }
                    else {
                        con.query(`SELECT * FROM google WHERE id = '${id}'`, (err, user) => {
                            done(err, user);
                        })
                    }
                })
            }
            
        })
        

    })
    //#endregion
    
    //#region local-login
    passport.use('local-login', new LocalStragy({
        passReqToCallback: true
    }, (req, username, password, done) => {
        con.query(`SELECT * FROM local WHERE username = '${username}'`, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
            
            let hashPassword = user[0].password;
            //console.log(hashPassword);
            let compare = bcrypt.compareSync(password, hashPassword);
            //console.log(compare);
            if (!compare) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            return done(null, user[0]);
        })
    }))
    //#endregion
    
    //#region  local-signup
    passport.use('local-signup', new LocalStragy({
        passReqToCallback: true
    }, (req, username, password, done) => {
        con.query(`SELECT * FROM local WHERE username = '${username}'`, (err, user) => {
            if (err) return done(err);
            if (user.length !== 0) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken'))
            }
            else {
                //console.log("debugger")
                let hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
                //console.log(hashPassword);
                con.query(`INSERT INTO local (username, password) VALUES ('${username}', '${hashPassword}')`, (err, result) => {
                    if (err) return done(err);
                    else {
                        con.query(`SELECT * FROM local WHERE username = '${username}'`, (err, user) => {
                            if(err) return done(err)
                            else return done(null, user[0]);
                        })
                    }
                })
            }
        })
    }
    ))
    //#endregion

    //#region facebook

    passport.use(new FacebookStragy({
        clientID: Config.facebookAuth.clientID,
        clientSecret: Config.facebookAuth.clientSecret,
        callbackURL: Config.facebookAuth.callbackURL,
        profileFields: Config.facebookAuth.profilefields
    }, 
    
        (accessToken, refreshToken, profile, done) => {
            //console.log(profile);
            const value = {
                id: profile._json.id,
                email: profile._json.email,
                name: profile._json.name
            }
            console.log(value.id, value.email, value.name);
            con.query(`SELECT * FROM facebook WHERE id = ${value.id}`, (err, user) => {
                if(err) return done(err)
                if(user.length !== 0) return done(null, user[0])
                else{
                    con.query(`INSERT INTO facebook (id, name, email, token) VALUES ('${value.id}', '${value.name}', '${value.email}', '${accessToken}')`, (err, result) => {
                            if(err) return done(err);
                            else{
                                con.query(`SELECT * FROM facebook WHERE id = '${value.id}'`, (err, user) => {
                                    if(err) return done(err)
                                    else return done(null, user[0]);
                                })
                            }
                    })
                }
            })
        }
    ))

    //#endregion

    passport.use(new GoogleStragy({
        clientID: Config.googleAuth.clientID,
        clientSecret: Config.googleAuth.clientSecret,
        callbackURL: Config.googleAuth.callbackURL
    }, 
    (accessToken, refreshToken, profile, done) => {
        const value = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        }
        con.query(`SELECT * FROM google WHERE (id = '${value.id}')`, (err, user) => {
            if(err) return done(err);
            if(user.length > 0) return done(null, user[0]);
            else{
                con.query(`INSERT INTO google (id, name, email, token) 
                VALUES ('${value.id}', '${value.name}', '${value.email}', '${accessToken}')`, (err, result) =>{
                    if(err) return done(err);
                    else {
                        con.query(`SELECT * FROM google WHERE (id = '${value.id}')`, (err, user) => {
                            if(err) return done(err);
                            else return done(null, user[0])
                        })
                    }
                })
            }
        })
    }
))

}