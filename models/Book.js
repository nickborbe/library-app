const mongoose = require('mongoose');
const Schema = mongoose.Schema


const bookSchema = new Schema({

    title: {type: String},
    author: {type: Schema.Types.ObjectId, ref: 'Author'},
    image: String

})



const Book = mongoose.model('Book', bookSchema);
//                              |
// mongoose will create a collection called books because we called the model Book
// it takes the word, makes it lower case, and then puts an S on the end



module.exports = Book;


