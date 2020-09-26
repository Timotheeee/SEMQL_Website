
const
        express = require('express'),
        exphbs = require('express-handlebars'),
        bodyParser = require('body-parser'),
        morgan = require('morgan'),
        session = require('express-session'),
        csv = require('fast-csv'),
        fs = require('fs');
app = express();

app.use(express.static(__dirname + '/public'));


var server = app.listen(process.env.PORT || 8001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening at http://' + host + ':' + port);
});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));





//function save() {
//    fs.writeFile("./db.json", JSON.stringify(allprojects), function (err) {
//        if (err) {
//            return console.log(err);
//        }
//    });
//}
//function load() {
//    var data = [];
//    fs.createReadStream('annotation_data.csv')
//            .pipe(csv())
//            .on('data', (row) => {
//                var txt = JSON.stringify(row);
//                console.log(txt);
//                data.push(txt);
//            })
//            .on('end', () => {
//                console.log('CSV file successfully processed');
//            });
//    return data;
//}

var data = [];
fs.createReadStream('annotation_data.csv')
        .pipe(csv.parse({headers: true}))
        .on('data', (row) => {
            //var txt = JSON.stringify(row);
            data.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });

/*
fs.createReadStream('annotation_data.csv')
    .pipe(csv())
    .on('data', (row) => {
        //var txt = JSON.stringify(row);
        data.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
*/

app.get('/api/data/', function (req, res) {
    //load();
    //var dat = fs.readFileSync('annotation_data.csv', 'utf8');
    //console.log(dat); 
    res.status(200).json({data: data});
});


//example
app.get('/api/*', function (req, res) {
    console.log(req.body.data);
    console.log(req.url);
});