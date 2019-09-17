const express = require('express');
const router  = express.Router();

const Book    = require('../models/Book');
const Author  = require('../models/Author'); 



router.get('/books', (req, res, next)=>{
    Book.find()
    .then((allTheBooks)=>{

        res.render('book-views/books-list', {books: allTheBooks})

    })
    .catch((err)=>{
        next(err);
    })


})


router.get('/books/details/:theid', (req, res, next)=>{
    let id = req.params.theid


    Book.findById(id).populate('author')
    .then((bookObject)=>{

        res.render('book-views/details', {theBook: bookObject})

    })
    .catch((err)=>{
        next(err);
    })
})



router.get('/books/create-new-book', (req, res, next)=>{

    // we need a list of all the authors on this page so we do
    Author.find()
    .then((result)=>{
        
        res.render('book-views/new-book', {allTheAuthors: result});
    })
    .catch((err)=>{
        next(err)
    })
    

    
})



router.post('/books/creation', (req, res, next)=>{

    console.log('=-=-=--=--=', req.body)

    let title = req.body.theTitle;
    let author = req.body.theAuthor;
    let image = req.body.theImage;


    Book.create({
        title: title,
        author: author,
        image: image
    })
    .then((result)=>{

        res.redirect('/books')
        //its literally sending us to localhost:3000/books

    })
    .catch((err)=>{
        next(err);
    })
})


router.post('/books/delete/:id', (req, res, next)=>{
    let id = req.params.id;

    Book.findByIdAndRemove(id)
    .then((result)=>{
        res.redirect('/books')
    })
    .catch((err)=>{
        next(err)
    })
})


router.get('/books/editbook/:id', (req, res, next)=>{
    let id=req.params.id;

    Book.findById(id)
    .then((theBook)=>{
        res.render('book-views/edit', {book: theBook})
    })
    .catch((err)=>{
        next(err)
    })
})


router.post('/books/update/:id', (req, res, next)=>{

    let id=req.params.id;

    Book.findByIdAndUpdate(id, {

        title: req.body.theTitle,
        author: req.body.theAuthor,
        image: req.body.theImage

    })
    .then((result)=>{
        res.redirect('/books/details/'+id)
    })
    .catch((err)=>{
        next(err);
    })

})









module.exports = router;
