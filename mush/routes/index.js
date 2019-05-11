express = require('express');
router = express.Router();
mongoose = require('mongoose');
Schema = mongoose.Schema;

//TODO move db work to another file
//Data for queries
//structure: {param: [{label:value}, ..]}
data = {
    cap_shape : [{ bell:"b"}, {conical:"c"},
        {convex:"x"}, {flat:"f"}, { knobbed:"k"}, {sunken:"s"}],
    cap_surface : [{ fibrous:"f"}, {grooves:"g"}, {scaly:"y"}, {smooth:"s"}],
    cap_color : [{ brown:"n"}, {buff:"b"}, {cinnamon:"c"}, {gray:"g"},
        {green:"r"}, { pink:"p"}, {purple:"u"}, {red:"e"}, {white:"w"}, {yellow:"y"}],
    bruises: [{ bruises:"t"}, {no:"f"}],
    odor : [{ almond:"a"}, {anise:"l"}, {creosote:"c"},
        {fishy:"y"}, {foul:"f"}, { musty:"m"}, {none:"n"}, {pungent:"p"}, {spicy:"s"}],
    gill_attachment : [{ attached:"a"}, {descending:"d"}, {free:"f"}, {notched:"n"}],
    gill_spacing : [{ close:"c"}, {crowded:"w"}, {distant:"d"}],
    gill_size : [{ broad:"b"}, {narrow:"n"}],
    gill_color : [{ black:"k"}, {brown:"n"}, {buff:"b"},
        {chocolate:"h"}, {gray:"g"}, { green:"r"}, {orange:"o"}, {pink:"p"}, {purple:"u"}, {red:"e"}, { white:"w"}, {yellow:"y"}],
    stalk_shape : [{ enlarging:"e"}, {tapering:"t"}],
    stalk_root : [{ bulbous:"b"}, {club:"c"}, {cup:"u"},
        {equal:"e"}, { rhizomorphs:"z"}, {rooted:"r"}, {missing:"?"}],
    stalk_surface_above_ring : [{ fibrous:"f"}, {scaly:"y"}, {silky:"k"}, {smooth:"s"}],
    stalk_surface_below_ring : [{ fibrous:"f"}, {scaly:"y"}, {silky:"k"}, {smooth:"s"}],
    stalk_color_above_ring : [{ brown:"n"}, {buff:"b"}, {cinnamon:"c"}, {gray:"g"}, {orange:"o"}, { pink:"p"}, {red:"e"}, {white:"w"}, {yellow:"y"}],
    stalk_color_below_ring : [{ brown:"n"}, {buff:"b"}, {cinnamon:"c"}, {gray:"g"}, {orange:"o"}, { pink:"p"}, {red:"e"}, {white:"w"}, {yellow:"y"}],
    veil_type : [{ partial:"p"}, {universal:"u"}],
    veil_color : [{ brown:"n"}, {orange:"o"}, {white:"w"}, {yellow:"y"}],
    ring_number : [{ none:"n"}, {one:"o"}, {two:"t"}],
    ring_type : [{ cobwebby:"c"}, {evanescent:"e"}, {flaring:"f"}, {large:"l"}, { none:"n"}, {pendant:"p"}, {sheathing:"s"}, {zone:"z"}],
    spore_print_color : [{ black:"k"}, {brown:"n"}, {buff:"b"}, {chocolate:"h"}, {green:"r"}, { orange:"o"}, {purple:"u"}, {white:"w"}, {yellow:"y"}],
    population : [{ abundant:"a"}, {clustered:"c"}, {numerous:"n"}, { scattered:"s"}, {several:"v"}, {solitary:"y"}],
    habitat : [{ grasses:"g"}, {leaves:"l"}, {meadows:"m"}, {paths:"p"}, { urban:"u"}, {waste:"w"}, {woods:"d"}]
}

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
    region: String
});

//Connection for models
const connection = mongoose.createConnection('mongodb+srv://Totem:12345@db-4mje1.gcp.mongodb.net/Mushrooms', {useNewUrlParser: true});
connection.on('open', function () {
    console.log('Connection to db for mainQuery established');
});
connection.on('error', console.error.bind(console, 'connection error:'));

//Models
var mushroom = connection.model('Mushroom', sch, 'Mushrooms');
var suggestion = connection.model('Suggestion', sch, 'Suggestions')

//Routes
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/params', function (req, res, next) {
   res.json(JSON.stringify(data));
});

router.get('/search', function (req, res, next) {
    console.log("Someone is trying to search our secrets");
    if( req.query.name === "" )
        delete req.query.name;
    res.render('search', {query: JSON.stringify(req.query)});
});

//Admins
router.get('/adminauth', function(req, res) {
    res.render('adminauth', { title: 'Admin Panel'});
});

router.get('/adminpanel', function(req, res) {
    res.render('adminpanel', { title: 'Admin Panel'});
});

//Querying to db
router.get('/db-query', function (req, res, next) {
    if( 'name' in req.query )
    {
        req.query.name = {$regex: req.query.name};
    }
    console.log(req.query);
    mushroom.find(req.query, function (err, mush) {
        res.send(mush);
    });
});

router.get('/suggestions', function (req, res, next) {
    suggestion.find('', function (err, sugg) {
        res.send(sugg);
    })
})

router.post('/mushroom', function (req, res, next) {
    let sugg = new suggestion(req.body);
    console.log(sugg);
    sugg.save(function (err) {
        console.log('NANIII');
        console.log(err);
    });
    console.log(req.body);
});

module.exports = router;