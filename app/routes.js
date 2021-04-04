
//worked with my house hayden 


module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
      db.collection('balance').find().toArray((err, result) => {
        let lastGameInfo = result[Object.keys(result)[Object.keys(result).length - 1]],
            overThousand;
            console.log(lastGameInfo);
        if (lastGameInfo!==undefined)
          if (lastGameInfo.bettingAmount >= 1000)
            overThousand = addCommas(lastGameInfo.bettingAmount)
        res.render('index.ejs', {
          lastGame: lastGameInfo,
          overThousand: overThousand
        })
      })
    });

    // ADMIN SECTION =========================
    app.get('/admin', isLoggedIn, function(req, res) {
        db.collection('balance').find().toArray((err, result) => {
          let wins = 0, losses = 0, profit, winsOverThousand, lossesOverThousand, profitOverThousand;
          //FINAL DRAFT
          for(game of result) {
            (game.houseWins ? wins += game.bettingAmount : losses += game.bettingAmount)
          }
          profit = Math.abs(wins - losses);
          if (wins >= 1000)
            winsOverThousand = addCommas(wins);
          if (losses >= 1000)
            lossesOverThousand = addCommas(losses);
          if (profit >= 1000)
            profitOverThousand = addCommas(profit);
          //FIRST DRAFT
          // for(money of result) {
          //   (money.result > 0 ? wins += money.result : losses += money.result)
          // }
          if (err) return console.log(err)
          res.render('balance.ejs', {
            user : req.user,
            games: result,
            wins: wins,
            losses: losses,
            profit: profit,
            winsOverThousand: winsOverThousand,
            lossesOverThousand: lossesOverThousand,
            profitOverThousand: profitOverThousand
          })
        })
    });

    function addCommas(money) {
      console.log(money);
      let converted = [];
      zeroes = 0;
      money.toString().split('').reverse().forEach((char, index) => {
        converted.push(char);
        zeroes++;
        if (zeroes === 3) {
          converted.push(',');
          zeroes = 0;
        }
      })
      console.log(converted);
      return converted.reverse().join('');
    }

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// Game results ===============================================================

    // FINAL DRAFT
    app.post('/game', (req, res) => {
      console.log('hello');
        db.collection('balance').save({bettingAmount: req.body.bettingAmount, betOn: req.body.betOn, landed: req.body.landed, houseWins: req.body.houseWins}, (err, result) => {
          if (err) return console.log(err)
          console.log('game saved')
          res.redirect('/')
        })
  })

  //  FIRST DRAFT OF DB POST
  //   app.post('/game', (req, res) => {
  //     console.log('hello');
  //       db.collection('balance').save({result: req.body.result}, (err, result) => {
  //         if (err) return console.log(err)
  //         console.log('game saved')
  //         console.log(req.body.result);
  //         res.redirect('/')
  //       })
  // })

    // app.put('/messages', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })
                                                      //app.
                                                        //To create:       post
                                                        //To edit/update:  put
                                                        //To read/display: get
                                                        //To delete:       delete
    // app.put('/messages/down', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp - 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    // app.delete('/messages', (req, res) => {
    //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/admin', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/login', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
