const express = require('express');
const router = express.Router();

const multer = require('multer');
var path = require('path');
const fs = require('fs');

var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

const Toilet = require('../model/toilet');
const Task = require('../model/task');

const service = require('../service/service');

let rootDestinationPath = path.join(__dirname, '..', 'uploads', 'images');

// var storage = multer.diskStorage(
//     {
//         destination:function ( req, file, cb ) {
//             let desPath = path.join(rootDestinationPath,req.body.name);
//             console.log(desPath);
//             if (!fs.existsSync(desPath)){
//                 console.log("destination path is not exists and have to create");
//                 fs.mkdir(desPath,{recursive: true}, err => {});
//             }
//             cb( null, desPath);
//         },
//         filename: function ( req, file, cb ) {
//             cb( null, rNumbereq.body.name +"_"+file.originalname );
//         }
//     }
// );

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({storage: storage})
    // .array('images', 3)
;

// const toilet = {
//     name: "Sand House",
//     photos: {
//         image1: "http://url1",
//         image2: "http://url2",
//         image3: "http://url3"
//     },
//     description: {
//         femaleFriendly: false,
//         urineTanks: true,
//         waterSink: false,
//         mirror: false,
//         shower: true
//     },
//     rating: 4,
//     location: {
//         type: "Point",
//         coordinates: [-112.110492, -36.098948]
//     },
// }


router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.render('index', {
        tasks
    });
});

router.get('/test', async (req, res, next) => {
    let dt = service.isAny(51.0001, 50.0000001, 200)
        .then((dt) => res.status(200).json({
                status: 'DONE',
                payload: {dt}
            })
        );
    // console.log(dt);
    // res.status(200).json({
    //     status: 'DONE',
    //     payload: {dt}
    // });
});

router.get('/get-all', async (req, res, next) => {
    const toilets = await Toilet.find();
    res.status(200).json({
        status: 'DONE',
        payload: {toilets}
    });
});

router.post('/add', async (req, res, next) => {
    let status;
    let message;

    let long = req.body.location.coordinates[0];
    let latt = req.body.location.coordinates[1];
    let maxDist = 200;

    const db_toilets = await Toilet.find({
        location: {
            $near: {
                $maxDistance: maxDist,
                $geometry: {
                    type: "Point",
                    coordinates: [long, latt]
                }
            }
        }
    }).find((error, results) => {
        if (error) console.log(error);
        // console.log(JSON.stringify(results, 0, 2));
    });

    if (db_toilets.length > 0) {
        status = "FAILED";
        message = "location already Exists"
    } else {
        const newToilet = new Toilet(req.body);
        newToilet.save((err, message) => {
            if (err) console.log(err);
            console.log(message);
        });
        status = "OK";
        message = "location added successfully";
    }
    res.status(200).json({
        status,
        message,
        payload: {req: req.body}
    });
});

const type = upload.single('file');


// router.post('/add', type, async (req, res, next) => {
//     let status;
//     let message;
//     //
//     // let long = req.body.location.coordinates[0];
//     // let latt = req.body.location.coordinates[1];
//     // let maxDist = 200;
//
//     // const db_toilets = await Toilet.find({
//     //     location: {
//     //         $near: {
//     //             $maxDistance: maxDist,
//     //             $geometry: {
//     //                 type: "Point",
//     //                 coordinates: [long, latt]
//     //             }
//     //         }
//     //     }
//     // }).find((error, results) => {
//     //     if (error) console.log(error);
//     //     // console.log(JSON.stringify(results, 0, 2));
//     // });
//
//     let db_toilets = [];
//
//     if (db_toilets.length > 0) {
//         status = "FAILED";
//         message = "location already Exists"
//     } else {
//         try {
//             upload(req, res, function (err) {
//                 if (err) {
//                     console.log("Error" + err);
//                     return res.json({
//                         // success:false,
//                         status: "FAILED",
//                         message: "Image upload failed.",
//                         error: err
//                     });
//                 } else {
//                     const newToilet = new Toilet(req.body);
//                     newToilet.save((err, message) => {
//                         if (err) console.log(err);
//                         console.log(message);
//                     });
//                     status = "OK";
//                     message = "location added successfully";
//                 }
//             });
//         } catch (err) {
//             console.log("router Error:" + err);
//         }
//     }
//     res.status(200).json({
//         status,
//         message,
//         payload: {req: req.body}
//     });
// });

router.post('/near', async (req, res, next) => {
    let long = req.body.long;
    let latt = req.body.latt;
    let maxDist = req.body.maxDist > 0 ? req.body.maxDist : 2000;

    const db_toilets = await Toilet.find({
        location: {
            $near: {
                $maxDistance: maxDist,
                $geometry: {
                    type: "Point",
                    coordinates: [long, latt]
                }
            }
        }
    }).find((error, results) => {
        if (error) console.log(error);
        // console.log(JSON.stringify(results, 0, 2));
        // return results;
    });

    res.status(200).json({
        status: 'DONE',
        payload: {db_toilets}
    });
});

router.post('/nearest', async (req, res, next) => {
    let long = req.body.long;
    let latt = req.body.latt;
    let maxDist = req.body.maxDist > 0 ? req.body.maxDist : 2000;

    const db_toilets = await Toilet.find({
        location: {
            $near: {
                $maxDistance: maxDist,
                $geometry: {
                    type: "Point",
                    coordinates: [long, latt]
                }
            }
        }
    }).find((error, results) => {
        if (error) console.log(error);
        // console.log(JSON.stringify(results, 0, 2));
        // return results;
    });

    res.status(200).json({
        status: 'DONE',
        payload: {db_toilets}
    });
});


module.exports = router;