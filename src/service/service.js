const Toilet = require('../model/toilet');

let isAny = async (lon, lat, maxDist) => {
    let db_toilets = await Toilet.find({
        location: {
            $near: {
                $maxDistance: maxDist,
                $geometry: {
                    type: "Point",
                    coordinates: [lon, lat]
                }
            }
        }
    }).find((error) => {
        if (error) console.log("isAny:" + error);
    });
    return db_toilets;
};

let addNewToilet = (toilet) => {
    const newToilet = new Toilet(toilet);
    newToilet.save((err, message) => {
        if (err) console.log("Saving Error: " + err);
        console.log(message);
    });
};


module.exports = {
    isAny, addNewToilet
};