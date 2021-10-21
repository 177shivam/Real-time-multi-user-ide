const wsc = new WebSocket('ws://192.168.29.173:5678');
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

function sendData(data){
	// console.log("send");
	// wsc.addEventListener('open', function (event) {
	//     wsc.send(data);
	// });
	// console.log();
	wsc.send(JSON.stringify({type:2,data:data,url:window.location.pathname.split('/')[2] }));
}


wsc.onmessage = function (event) {
	let message = JSON.parse(event.data); 
  console.log("r on c: " + message.data);
  document.getElementById('code').value=message.data;
  setCursor();
}
	


// wsc.send('hello ji');