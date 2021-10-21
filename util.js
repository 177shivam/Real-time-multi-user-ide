const {spawn}  =require('child_process');
const fs = require('fs');


function compile()
{
	var res=spawn('g++ ctes.cpp');
	res.stdout.on('data', (data)=>{
		console.log('$(data)');
		return 1;
	});
	es.stderr.on('data', (data)=>{
		console.log('$(data)');
		return 0;
	});
}

function exe(userInput){
	var res= spawn('time ./a.out');
	res.stdin.write('$(userInput)');
	res.stdin.end();
	res.stdout.on('data', (data)=>{
		console.log('$(data)');
		return 1;
	});

	es.stderr.on('data', (data)=>{
		console.log('$(data)');
		return 0;
	});
}
