var express= require('express');
const {query}=require('express');
var crypto = require('crypto');
const {Server } = require('http');
var fs= require('fs');
const util = require('./util');
const wbs = require('./websocket');
const index = fs.readFileSync('./index.html','utf-8');
const clientSoc = fs.readFileSync('./clientSoc.js', 'utf-8');
const clientscript = fs.readFileSync('./clientscript.js', 'utf-8');
const bodyParser = require("body-parser");

const {spawn}  =require('child_process');
const exe = require("child_process").execSync;

var dataRes= "";


function genRandom()
{
	var id =crypto.randomBytes(6).toString('hex');
	console.log(id);
}

function compile()
{
	try
	{
		// var res=spawn('g++',[' ctes.cpp']);
		// Timeout()
		var res=exe('g++ ctes.cpp');
		// res.stdout.pipe('data', (data)=>{
		// 	console.log(' $(data)');
		// 	return 1;
		// });
		// res.stderr.pipe('data', (data)=>{
		// 	console.log('$(data)');
		// 	return 0;
		// });
		console.log(res.toString('utf-8'));
		if(res.toString('utf-8').length >1) 
		{
			// res.kill();
			return 0;
		}
		return 1;
	}
	catch (err){
		dataRes = err.stderr.toString('utf-8');
		console.log(err);
	}
}
function pass(){}

function exec(userInput){
	// var res= exe(' ./a.out');
	var res=spawn('./a.out');
	dataRes= "";
	res.stdin.write(userInput+"\n");
	res.stdin.end();
	setTimeout(pass, 5000);
	// dataRes= res.toString('utf-8');
	// console.log(res.toString('utf-8'));
	res.stdout.on('data', (data)=>{
		console.log(data.toString('utf-8'));
		dataRes= console.log(data.toString('utf-8'));
		// console.log(;
		return 1;
	});

	res.stderr.on('data', (data)=>{
		console.log('$(data)');
		return 0;
	});

	console.log(res.toString('utf-8'));
	dataRes= res.toString('utf-8');
	// if(res.toString('utf-8').length >1) return 0;
	return 1;
}


var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/',(req,res)=>{
	res.end(index);
});

app.get('/edit/clientSoc.js',(req,res)=>{
	res.end(clientSoc);
});

app.get('/edit/clientscript.js',(req,res)=>{
	res.end(clientscript);
});


app.get('/clientSoc.js',(req,res)=>{
	res.end(clientSoc);
});

app.get('/clientscript.js',(req,res)=>{
	res.end(clientscript);
});


app.get('/edit/*',(req,res)=>{
	console.log(req.params[0]);
	// var data= mapData[req.params[0]];
	// res.send({data:"sending11"});
	res.end(index);
	// wbs.send("sending00");
	console.log("wb")
});

app.post('/submit',(req,res)=>{
	// let lang = req.query['lang'];
	let code=req.body.code;
	let userInput = req.body.user;
	console.log(code);
	const fd =fs.openSync('ctes.cpp','w+');
	// fs.ftruncate(fd,(err)=>{
	// 	if(err)
	// 		console.log(err);
	// });document.getElementById('code').value;

	// fs.write(fd,code,0,code.length,null, function(err){
	// 	if(err)
	// 		console.log("write failed");
		
	// });
	fs.writeFile(fd, code, err => {
	  if (err) {
	    console.error(err)
	    return
	  }
	});
	// fs.close();
	let compileSucess=0;
	let exeSuccess=0;
	let state = 'processing';


	compileSucess=compile();

	if(compileSucess == 1)
	{
		state='executing';
		exeSuccess = exec(userInput);
		if(exeSuccess == 1)
		{
			state="success fully executed"
		}
		else
		{
			state="execution failed";
		}
		
	}
	else
	{
		state = "Compilation failed";
	}
	res.end(dataRes + " \n"+state);



});

var server=app.listen(81,"192.168.29.173",()=>{
	console.log('listening');
});

wbs;