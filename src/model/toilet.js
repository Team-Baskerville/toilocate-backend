const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToiletSchema = Schema({
    name: String,
    // photos:{
    //   image1:{url:String},
    //   image2:{url:String},
    //   image3:{url:String}
    // },
    gender: String,
    imagePath: String,
    description: {
        femaleFriendly: {
            type: Boolean,
            default: false
        },
        urineTanks: {
            type: Boolean,
            default: false
        },
        waterSink: {
            type: Boolean,
            default: false
        },
        mirror: {
            type: Boolean,
            default: false
        },
        shower: {
            type: Boolean,
            default: false
        },
        commode: {
            type: Boolean,
            default: false
        },
        squat: {
            type: Boolean,
            default: false
        }
    },
    rating: Number,
    location: {
        type: {type: String},
        coordinates: []
    },
    status: {
        type: Boolean,
        default: false
    },
});

ToiletSchema.index({location: "2dsphere"});

module.exports = mongoose.model('toilet', ToiletSchema);
