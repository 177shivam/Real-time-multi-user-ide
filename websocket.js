const wbskt = require('ws');
let connected =[];
var urlSocketMap =new Map();
var mapData = new Map();

const ws = new wbskt.Server({ port: 5678 });

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
					cons[i].send(JSON.stringify({data:newdata, rsi:message.si}));
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

return ws;