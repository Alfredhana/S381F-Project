const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    restaurant_id:{
        type: String,
        required: false
    },
    name:{
        type: String,
        required: true
    },
    borough:{
        type: String,
        required: false
    },
    cuisine:{
        type: String,
        required: false
    },
    photo{
        
    }

});
const Restaurant = mongoose.model('restaurant', RestaurantSchema);

module.exports = Restaurant;