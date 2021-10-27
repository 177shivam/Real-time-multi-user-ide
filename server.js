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
// const favicon = fs.readFileSync('./favicon.ico', 'utf-8');
const bodyParser = require("body-parser");

const {spawn}  =require('child_process');
const exe = require("child_process").execSync;

var dataRes= "";
var hostIP ="192.168.29.173";

function genRandom()
{
	var id =crypto.randomBytes(3).toString('hex');
	console.log(id);
	return id;
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
		console.log("com"+res.toString('utf-8'));
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

function exec(userInput,ress){
	// var res= exe(' ./a.out');
	var res=spawn('./a.out',{detached: false});
	dataRes= "";
	res.stdin.write(userInput+"\n");
	res.stdin.end();
	// setTimeout(pass, 12000);
	// await new Promise(resolve => setTimeout(resolve, 5000));
	// dataRes= res.toString('utf-8');
	console.log(res.toString('utf-8'));
	let done = 0;

	res.stdout.on('data', (data)=>{
		console.log("dat" + data.toString('utf-8'));
		dataRes= data.toString('utf-8');
		// console.log(dataRes);
		// console.log(`stdout: ${data}`);
		done =1;
		ress.end("<HTML><HEAD></HEAD><BODY><b>Output:</b><br>"+dataRes+"</BODY></HTML>");
		// return 1;
	});

	res.stderr.on('data', (data)=>{
		console.log('$(data)');
		done =1;
		ress.end("<HTML><HEAD></HEAD><BODY><b>Output:</b><br>"+dataRes+"</BODY></HTML>");
		// return 0;
	});

	// while(!done)
	// {
		// await new Promise(resolve => setTimeout(resolve, 5000));
		// console.log("RE" + dataRes.toString('utf-8'));
		// dataRes= res.toString('utf-8');
		// return -1;
		// if(done == 1)
		// 	return 1;
		// if(res.toString('utf-8').length >1) return 0;
	// }
}


var app = express();

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/',(req,res)=>{
	// res.end(index);
	let ranURL = genRandom();
	res.redirect("/edit/"+ranURL);
});

app.get('/edit/clientSoc.js',(req,res)=>{
	res.end(clientSoc);
});

app.get('/edit/clientscript.js',(req,res)=>{
	res.end(clientscript);
});

app.post('/edit/submit',(req,res)=>{
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
	let exeSuccess=-1;
	let state = 'processing';


	compileSucess=compile();
	console.log("Compi "+ compileSucess);

	if(compileSucess == 1)
	{
		state='executing';
		exeSuccess = exec(userInput,res);
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
		console.log("fail");
		// res.end(dataRes + " \n"+state);
	}
	console.log("REs" + dataRes);
	// res.end(dataRes + " \n"+state);
});

app.get('/edit/*',(req,res)=>{
	// console.log(req.params[0]);
	// var data= mapData[req.params[0]];
	// res.send({data:"sending11"});
	res.end(index);
	// console.log("wb")
});

var server=app.listen(81,hostIP,()=>{
	console.log('listening');
});

wbs;