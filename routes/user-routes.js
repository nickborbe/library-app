const express = require('express');
const router  = express.Router();

const User    = require('../models/User');
const bcrypt  = require('bcryptjs');


const magicUploadTool = require('../config/coudinary-settings');

const nodemailer = require('nodemailer');


router.get('/signup', (req, res, next)=>{

    res.render('user-views/signup')

})
// you can have routes with the same name if one is get and one is post



router.post('/signup',magicUploadTool.single('the-image-input-name') ,(req, res, next)=>{
    console.log('=-=-=-=-', process.env.USER_NAME_GOOGLE, process.env.PASS)


    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.USER_NAME_GOOGLE,
          pass: process.env.PASS
        }
      });





    const username = req.body.theUsername;
    const password = req.body.thePassword;


    const salt  = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(password, salt);

    console.log('=-=-=-=-=-=-=-=-=-=-=-=-')
    console.log(req.body)
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-')
    console.log(req.file)


    let userObj = {};
    userObj.username = username;
    userObj.password = hash;
    userObj.email = req.body.email;
    userObj.active = false

    if(req.file){
        userObj.profileImage = req.file.url
    }


    User.create(userObj)
    .then((userThatJustGotCreated)=>{
// send the email in the .then because .then only happens if it works
// and also, it waits until after


// remember the user is typing in their email address
// as req.body.theUsername because I was too lazy to change the name everywhere
transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: req.body.email, 
    subject: "Thank you for signing up", 
    text: "Thanks for signing up.  Good luck with your anachronistic flip phone",
    html: `
    <h2>Thank You </h2>
    <p>Coolboy55 Thanks you for signing up for this service</p>
    <p>In Order to complete the signup process please confirm your email by clicking on the following link</p>
    <a href="http://localhost:3000/confirmation/${userThatJustGotCreated._id}"   >Confirm Email</a>
    `
  })
  .then((result)=>{
      req.flash('error', 'please check your email for a welcome email')
    res.redirect('/')
  })  
  .catch((err)=>{
      next(err)
  })





       

    })
    .catch((err)=>{
        next(err)
    })
})


router.get('/confirmation/:id', (req, res, next)=>{

    User.findByIdAndUpdate(req.params.id, {
        active: true
    })
    .then(()=>{
        req.flash('error', "thanks for confirming your email please log in to continue")
        res.redirect('/')
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

      if(!userfromDB.active){
        req.flash('error', 'Please confirm your email before logging in');
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