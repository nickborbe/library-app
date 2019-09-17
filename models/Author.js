const mongoose = require('mongoose');
const Schema = mongoose.Schema


const authorSchema = new Schema({

    name: String,
    birthday: String,
    image: String

})



const Author = mongoose.model('Author', authorSchema);
//                              |
// mongoose will create a collection called books because we called the model Book
// it takes the word, makes it lower case, and then puts an S on the end



module.exports = Author;


