'use strict'
const socketio = require('socket.io')
var conectados=0;

module.exports=function(server){
	const io =socketio(server)
	io.on('connection',onConection)

	//-------------

	function onConection(socket){
		console.log(`cliente conectado ${socket.id}`);
		conectados++;
		socket.broadcast.emit('conexiones',{conectados:conectados})
		
		socket.on('disconnect',function(){
			conectados--;
			console.log(`cliente desconectado ${socket.id}`);
			socket.broadcast.emit('conexiones',{conectados:conectados})
		})
		socket.on('moverMouse',function(data){
			socket.broadcast.emit('mover',data)
		})
	}

}