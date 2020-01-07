const Toilet = require('../model/toilet');

// async function isAny(lon, lat, maxDist) {
//     let db_toilets = await Toilet.find({
//         location: {
//             $near: {
//                 $maxDistance: maxDist,
//                 $geometry: {
//                     type: "Point",
//                     coordinates: [lon, lat]
//                 }
//             }
//         }
//     }).find((error, result) => {
//         if (error) console.log("isAny:" + error);
//         return  result;
//     });
//     return db_toilets;
// }

let addNewToilet = (toilet) => {
    const newToilet = new Toilet(toilet);
    newToilet.save((err, message) => {
        if (err) console.log("Saving Error: " + err);
        console.log(message);
    });
};

let getNear = async (coordinates, maxDist) => {
    return await Toilet.find({
        location: {
            $near: {
                $maxDistance: maxDist,
                $geometry: {
                    type: "Point",
                    coordinates: coordinates
                }
            }
        }
    }).find((error, result) => {
        if (error) console.log("isAny:" + error);
        return result;
    });
};


module.exports = {
    addNewToilet, getNear
};