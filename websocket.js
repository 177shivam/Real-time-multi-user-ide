const wbskt = require('ws');
// var http = require('http');
// var ap = require('./server.js');
let connected =[];
var urlSocketMap =new Map();
var mapData = new Map();




// var server = http.createServer(ap.app);
// server.listen(8100,"0.0.0.0",()=>{
// 	console.log('listening')});

// console.log("http server listening on %d", 8100);

let wss = wbskt.Server;
let server = require('http').createServer();
let app= require('./server.js');
let ws = new wss({ server: server });
server.on('request', app);


// const ws = new wbskt.Server({ port: 5678 });

ws.on('connection', function connection(con){
	connected.push(con);
	console.log("connected");
	// console.log(con);


	// con.send();

	con.on('message', function incoming(message){
		message=JSON.parse(message);
		console.log('mes %s',message);

		if(message.type==1)
		{
			let val = [];
			if(urlSocketMap.has(message.url))
			{
				// console.log("fond");
				val=urlSocketMap.get(message.url);
				con.send(JSON.stringify({data:mapData.get(message.url)}));
			}
			val.push(con);

			urlSocketMap.set(message.url,val);
			// console.log(urlSocketMap);
		}
		else
		{
			let valuedata= mapData.get(message.url);
			let newdata ="";
			

			if(message.op == 1)
			{
				newdata = valuedata.slice(0,message.si) + valuedata.substring(message.si+1,valuedata.length);
			}
			else if(message.op == 2)
			{
				if(mapData.has(message.url))
				{
					if(message.se >= 0)
					{
						newdata=message.data + valuedata.substring(message.se,valuedata.length);
					}
					else
					{
						newdata=message.data + valuedata.substring(message.cbp,valuedata.length);	
					}
				}
				else
				{
					newdata = message.data;
				}
			}
			else
			{
				if(mapData.has(message.url))
				{
					newdata=message.data + valuedata.substring(message.data.length-1,valuedata.length);
				}
				else
				{
					newdata = message.data;
				}
			}

			mapData.set(message.url,newdata);
			console.log(mapData.get("erte"));

			let cons=[];
			cons=urlSocketMap.get(message.url);
			for(let i in cons)
			{
				if(cons[i] != con)
				{
					// console.log("con" + cons[i]);
					if(message.op ==2)
					{
						var rsi;
						if(message.cpb==-1 || (message.si == message.cbp))
						{
							rsi = message.si - message.se;
						}
						// else if(message.si == message.cbp)
						// {

						// 	rsi = message.si - message.se;
						// }
						else
						{
							rsi=message.si - message.cbp;
						}
						cons[i].send(JSON.stringify({data:newdata, rsi:message.cbp, rsidiff:rsi}));
					}
					else if(message.op ==1)
					{
						cons[i].send(JSON.stringify({data:newdata, rsi:message.si, rsidiff:-1}));
					}
					else
					{
						cons[i].send(JSON.stringify({data:newdata, rsi:message.si-1, rsidiff:1}));
					}
				}
			}
		}


	});

	con.on('close',(client_soc) =>{
		connected.splice(connected.indexOf(client_soc.length),1);
		console.log("dscnt");
	});

	con.onerror = function(event) {
	 	console.error("WebSocket error observed:", event);
	};
});

server.listen(process.env.PORT || 8100,function(){
	console.log('listening on ')});


// return ws;