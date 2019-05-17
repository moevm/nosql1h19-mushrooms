express = require('express');
mongoose = require('mongoose');

router = express.Router();
Schema = mongoose.Schema;

var sch = new Schema({
    bruises: String ,
    cap_color: String ,
    cap_shape: String ,
    cap_surface: String ,
    gill_attachment: String ,
    gill_color: String ,
    gill_size: String ,
    gill_spacing: String ,
    habitat: String ,
    name: String,
    odor: String ,
    population: String ,
    ring_number: String ,
    ring_type: String ,
    spore_print_color: String ,
    stalk_color_above_ring: String ,
    stalk_color_below_ring: String ,
    stalk_root: String ,
    stalk_shape: String ,
    stalk_surface_above_ring: String ,
    stalk_surface_below_ring: String ,
    veil_color: String ,
    veil_type: String ,
    description: String,
    region: Array,
    img: String,
    edible: String
});

//Connection for models
const connection = mongoose.createConnection('mongodb+srv://Totem:12345@db-4mje1.gcp.mongodb.net/Mushrooms', {useNewUrlParser: true});
connection.on('open', function () {
    console.log('Connection to db established');
});
connection.on('error', console.error.bind(console, 'connection error:'));

//Models
var mushroom = connection.model('Mushroom', sch, 'Mushrooms');
var suggestion = connection.model('Suggestion', sch, 'Suggestions');

//Querying to main db
router.get('/query/main', function (req, res, next) {
    console.log('query');
    if( 'name' in req.query )
    {
        req.query.name = {$regex: req.query.name};
    }
    mushroom.find(req.query, function (err, mush) {
        res.send(mush);
    });
});

//Querying to suggestions
router.get('/query/suggestions', function (req, res, next) {
    suggestion.find({}, function (err, sugg) {
        res.send(sugg);
    })
});

//Add new suggestion
router.post('/add/main', function (req, res, next) {
    req.body.region = req.body.region.split(',');
    let sugg = new suggestion(req.body);
    console.log('there');
    console.log(sugg);
    sugg.save(function (err) {
        if( err )
            console.log('NANIII');
    });
    console.log(req.body);
    res.render('search', {query: JSON.stringify({name: ""})}); //TODO Duct Tape
});

//Add new/update mushroom
router.post('/adminPressedTheBlackButton', function (req, res, next) {
    let data = req.body;
    data.region = data.region.split(','); // , in the region into []
    if( 'ttype' in data ){
        if( data['ttype'] === 'admin' ) //update an existing mush
        {
            delete data.ttype;

            mushroom.updateOne({'_id': data._id},{$set: data}, function (err) {
                if(err){
                    console.log("can't update");
                }
            } )
        }
        else //add new one from suggestions
        {
            delete data.ttype;
            let id = data._id;
            delete data._id

            let mush = new mushroom(data);
            mush.save(function (err) {
                if( err ){
                    console.log('smth wrong, can"t save')
                }
                else{
                    suggestion.findOneAndDelete({_id: id}, function (err) {
                        if( err )
                            console.log("can't delete, HE IS TOO POWERFUL");
                    })
                }
            })
        }
    }
    else{ //Admin's mushroom
        console.log(req.body);
        aMush = new mushroom(req.body);
        aMush.save(function (err) {
            if(err){
                console.log("Kirito, it's 2 dangerous 2 go alone, take this stiletto and stab the Administrator");
            }
        })
    }
    res.render('adminpanel');
});

//Delete mushroom
router.post('/adminPressedTheRedButton', function (req, res, next) {
    let data = req.body;

    if( 'ttype' in data ){
        if( data.ttype === 'admin' ){ //form main db
            mushroom.deleteOne({"_id": data._id}, function (err) {
                if( err ){
                    console.log('RED BUTTON DOESN"T WORK, HE IS UNSTOPPABLE');
                }
            });
        }
        else{ //from suggestions
            suggestion.deleteOne({"_id": data._id}, function (err) {
                if( err ){
                    console.log('RED BUTTON DOESN"T WORK, HE IS UNSTOPPABLE');
                }
            })
        }
    }
    res.render('adminpanel');
});

module.exports = router;