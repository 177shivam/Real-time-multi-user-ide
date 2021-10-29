var ip ="192.168.29.173";
var url = "ws://"+ip+":5678";
const wsc = new WebSocket(url);
// ws.onmessage =function (event){
// 	console.log(event.data);
// }

// wsc.on('connect',function(){
// 	console.log('connect client');
// 	// socket.emit('ehlo', data);
// });
wsc.onopen = function (event) {
  wsc.send(JSON.stringify({type: 1, url:window.location.pathname.split('/')[2]}));
};

function sendData(data,curpos, insertType, selectEnd,cursorBeforePaste){
	// console.log("send");
	// wsc.addEventListener('open', function (event) {
	//     wsc.send(data);
	// });
	// console.log();
	wsc.send(JSON.stringify({type:2, si:curpos, op:insertType, se:selectEnd, cbp:cursorBeforePaste, data:data,url:window.location.pathname.split('/')[2] }));
}


wsc.onmessage = function (event) {
	let message = JSON.parse(event.data); 
  console.log("r on c: " + message.data);
  if(typeof message.data !== 'undefined')
  {
  	getpo();
  	document.getElementById('code').value=message.data;
  	setCursor(message);
	}
}

wsc.onerror = function(event) {
  console.error("WebSocket cl error observed:", event);
};
	


// wsc.send('hello ji');