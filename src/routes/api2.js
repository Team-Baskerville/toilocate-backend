const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');
const Toilet = require('../model/toilet');
const Image = require('../model/image');
const service = require('../service/service');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        var name = req.query.name;
        var originalFileName = file.originalname;
        name = name.replace(/\s/g, '');
        originalFileName = originalFileName.replace(/\s/g, '');
        let fileName = name + "_" + originalFileName;
        // console.log(fileName);
        cb(null, fileName);
        // cb( null, req.body.name +"_"+file.originalname );
    }
});

const upload = multer({storage: storage});
const type = upload.single('image');

// add image function
router.post('/image', type, (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Image uploaded successfully",
        payload: {
            imageURL: req.file.path
        }
    });
});

// get all toilets
router.get('/get-all', async (req, res, next) => {
    const toilets = await Toilet.find();
    res.status(200).json({
        status: 'DONE',
        payload: {toilets}
    });
});

// get near by toilets
router.post('/near', async (req, res, next) => {
    let coordinates = [req.body.longitude, req.body.latitude];
    let maxDist = req.body.maxDist > 0 ? req.body.maxDist : 20000;
    service.getNear(coordinates, maxDist)
        .then((results) => res.status(200).json({
            status: "OK",
            message: "Find near by toilets completed successfully",
            payload: {
                toilets: results
            }
        }));
});

// add toilet
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

module.exports = router;