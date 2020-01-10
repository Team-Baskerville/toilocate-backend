const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Task = require('../model/task');
const Toilet = require('../model/toilet');
const User = require('../model/user');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.get('/', async (req, res) => {
    const toilets = await Toilet.find();
    res.render('index', {
        toilets
    });
});

router.post('/add', async (req, res, next) => {
    let newToilet = {
        name: req.body.name,
        gender: req.body.gender,
        description:{
            femaleFriendly:req.body.femaleFriendly != undefined ? true : false,
            urineTanks: req.body.urineTanks != undefined ? true : false,
            waterSink: req.body.waterSink != undefined ? true : false,
            mirror: req.body.mirror != undefined ? true : false,
            shower: req.body.shower != undefined ? true : false,
            commode: req.body.commode != undefined ? true : false,
            squat: req.body.squat != undefined ? true : false
        },
        rating: parseInt(req.body.rating),
        location:{
            type: "Point",
            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
        },
        imagePath: req.body.imagePath
    };
    const toilet = new Toilet(newToilet);
    await toilet.save();
    res.status(200).json({
        status: 'DONE',
        payload: { toilet }
    });
});

// router.get('/turn/:id', async (req, res, next) => {
//     let {id} = req.params;
//     const task = await Task.findById(id);
//     task.status = !task.status;
//     await task.save();
//     res.redirect('/');
// });


router.get('/edit/:id', async (req, res, next) => {
    const toilet = await Toilet.findById(req.params.id);
    console.log(toilet);
    res.render('edit', { toilet });
});

router.post('/edit/:id', async (req, res, next) => {
    const { id } = req.params;
    let updateToilet = {
        name: req.body.name,
        gender: req.body.gender,
        description:{
            femaleFriendly:req.body.femaleFriendly != undefined ? true : false,
            urineTanks: req.body.urineTanks != undefined ? true : false,
            waterSink: req.body.waterSink != undefined ? true : false,
            mirror: req.body.mirror != undefined ? true : false,
            shower: req.body.shower != undefined ? true : false,
            commode: req.body.commode != undefined ? true : false,
            squat: req.body.squat != undefined ? true : false
        },
        rating: parseInt(req.body.rating),
        location:{
            type: "Point",
            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
        },
        imagePath: req.body.imagePath
    }
    await Toilet.update({_id: id}, updateToilet);
    res.redirect('/');
});

router.get('/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await Toilet.remove({ _id: id });
    res.redirect('/');
});

router.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('index2', {
        users
    });
});

router.get('/user/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await User.remove({ _id: id });
    res.redirect('/users');
});


module.exports = router;
