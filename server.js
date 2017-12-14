

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
	var ageCalculator = require('age-calculator');
	const bcrypt = require('bcrypt');
    let {AgeFromDateString, AgeFromDate} = require('age-calculator');
    // configuration =================
    mongoose.connect('mongodb://pbrm:pb300396@ds129166.mlab.com:29166/lead_students');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
	

	var user = mongoose.model('user',{
		email : String,
		hash : String
		
	});
	
	// define model =================
    var student = mongoose.model('student', {
        name : String,
		age : Number,
		date : Date,
		school : String,
		clas : String,
		division : String,
		sstatus : String
    });
	

    app.get('/api/studentdata', function(req, res) {
        student.find(function(err, students) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);
            res.json(students); // return all todos in JSON format
        });
    });

	app.post('/api/adduser',function(req,res){
		let hashh = bcrypt.hashSync(req.body.pass, 10);
		req.body.hash = hashh;
		
		user.create({
			email : req.body.email,
			hash : req.body.hash,
			done : false
		}, function(err,todo){
			
			if(err) res.send(err);
			
			});
		});
	
	app.post('/api/edit',function(req,res){
		let dataid = req.body.iid;
		student.findOne({"_id":dataid
		},function(err,student_data){
			if(err) 
				res.send(err);
			console.log(student_data);
			res.send(student_data);
		});
		
	});
	
	app.post('/api/loguser',function(req,res){
		let dataname = req.body.email;
		let passused = req.body.pass;
		//user.findOne({$where : "'email' == \""+ dataname  +"\"" 
		user.findOne({"email": dataname
		},function(err,login_data){
			if(err) 
				res.send(err);
			console.log(login_data.hash);
			if(bcrypt.compareSync(passused, login_data.hash)){
				login_data.message = "success";
			console.log(login_data.message);
			res.json(login_data.message);
			}
			else{
				login_data.message = "failed";
				console.log(login_data.message);
				res.json(login_data.message);
			}
			
		
		});
	
	});

	
    // create todo and send back all todos after creation
    app.post('/api/addstudents', function(req, res) {
			let ageFromDate = new AgeFromDate(new Date(req.body.date)).age;
            req.body.age = ageFromDate;
        // create a todo, information comes from AJAX request from Angular
        student.create({
            name : req.body.name,
			age : req.body.age,
			date : req.body.date,
			school : req.body.school,
			clas : req.body.clas,
			division : req.body.division,
			sstatus : req.body.soption,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            
            student.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    
    app.delete('/api/del/:todo_id', function(req, res) {
        student.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            
            student.find(function(err, students) {
                if (err)
                    res.send(err)
                res.json(students);
            });
        });
    });

	
	 //  -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/testUI.html'); 
    });
	
    // ======================================
    app.listen(8080);
    console.log("App listening on port 8080");