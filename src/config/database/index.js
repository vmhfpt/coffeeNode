const mongoose = require('mongoose');
async function connect(){
    try {
        await mongoose.connect('mongodb+srv://hung:AK47EVIL@cluster0.tq8jxdo.mongodb.net/coffee?retryWrites=true&w=majority');
        console.log('connect database success !');
    } catch {
        console.log('connect database error !');
    }
}
module.exports = {connect};