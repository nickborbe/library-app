const express = require('express');
const router  = express.Router();

const User    = require('../models/User');
const bcrypt  = require('bcryptjs');



router.get('/signup', (req, res, next)=>{

    res.render('user-views/signup')

})
// you can have routes with the same name if one is get and one is post



router.post('/signup', (req, res, next)=>{

    const username = req.body.theUsername;
    const password = req.body.thePassword;


    const salt  = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(password, salt);



    User.create({
        username: username,
        password: hash
    })
    .then(()=>{

        res.redirect('/')

    })
    .catch((err)=>{
        next(err)
    })
})



router.get('/login', (req, res, next)=>{

    res.render('user-views/login')

})

router.post('/login', (req, res, next)=>{
    const username = req.body.theUsername;
    const password = req.body.thePassword;

    // we are trying to find a user who's username is equal to the usernam variable we just created
User.findOne({ username: username })
  .then(userfromDB => {
      if (!userfromDB) {

            req.flash('error', 'sorry that username doesnt exist');
            // this is the same as doing the line below, just that flash does not allow us to interact with the object directly so it has special getters & setters
            // req.flash.error = 'sorry that username doesnt exist'

        res.redirect('/');
      }
      if (bcrypt.compareSync(password, userfromDB.password)) {
        // Save the login in the session!
        req.session.currentuser = userfromDB;
        // this is the magic ^ line of code that actually logse you in
        res.redirect("/");
      } else {
          res.redirect('/')
      }
  })
  .catch(error => {
    next(error);
  })




})


router.post('/logout', (req, res, next)=>{

    req.session.destroy();

    res.redirect('/');

})


router.get('/secret', (req, res, next)=>{

    if(req.session.currentuser){
        res.render('user-views/secret', {theUser: req.session.currentuser})
    } else{
        res.redirect('/')
    }



})






module.exports = router;