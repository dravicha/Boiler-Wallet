const express = require('express')
const exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var dbConnection = mongoose.connect('mongodb+srv://dravicha:cs252@boiler-wallet-3r0z7.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
})
.then(()=> console.log('Mongo connected'))
.catch(err => console.log(err));

var currentUserCodes, currentUserName;

require('./models/User');
require('./models/Club');
require('./models/Expenses');
const User = mongoose.model('Users');
const Club = mongoose.model('Clubs');
const Expenses = mongoose.model('Expenses');

// telling the system we want to use handlebars template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(function(req,res,next){
    console.log(Date.now());
    next();
});

app.use(express.static("."));

app.get('/', (req,res) => {
    const title = 'Passing a variable into the view';
    res.render('login', {
        title:title
    }); 
});

app.get('/about', (req,res) => {
    getClubs();
    res.render('ABOUT');
});

app.get('/contact', (req,res) => {
    res.render('CONTACT');
});



app.get('/clubs', (req,res) => {
    var clubList;
    Club.find({}, function (err, myClubs){
        if(myClubs!=null){
            clubList = getClubs(myClubs);
            console.log(clubList);
            res.render('clubs', {
                clubList:clubList
            });
        }
    });   
});

app.get('/expenses', (req, res) => {
    console.log(req.body);
    //var clubSelected = req.body.title; //title of club clicked
    //var clubCode = req.body.code;
    //var userName;

    //console.log(clubSelected);
    //console.log(code);

    //var queryRes = Expenses.find({user: userName});
    //console.log(queryRes);

});

app.post('/sign-in-submit', (req, res) => {

    let errors = [];

    if(!req.body.email){
        errors.push({text: 'Missing email address'});
    }
    if(!req.body.password){
        errors.push({text: 'Missing password'});
    }

    if(errors.length > 0){
        res.render('login', {
            errors:errors,
            email: req.body.email,
            password: req.body.password,
            
        });
    }
    else{
        const pass = req.body.password;
        User.findOne({email: req.body.email}, function (err, myUser) {
            if (myUser != null){
                if(pass === myUser.password){
                    currentUserCodes = myUser.codes;
                    currentUserName = myUser.name;
                    res.redirect('clubs');
                }
                else{
                    errors.push({text: 'Wrong password!'});
                    
                    res.render('login', {
                        errors:errors,
                        email: req.body.email,
                        password: req.body.password,
                    });
                
                }
            } 
            else{
                errors.push({text: 'Wrong login credentials!'});
                res.render('login', {
                    errors:errors,
                    email: req.body.email,
                    password: req.body.password,
                });
            }
        })
        
    }
});

const port = 5061;

server = app.listen(port, () => {
    console.log(`Server started: ${port}`);
});

/* 
    function to get the list of clubs
*/
function getClubs(myClubs){
    let clubList = []; 
    var length = myClubs.length;
    for(var i = 0; i < length ; i++){
       clubList.push(myClubs[i].title);
    }
   return clubList;
}

/* 
    function to get the list of expesnes by specific user
*/

function getExpenses(code, club, user) {

}