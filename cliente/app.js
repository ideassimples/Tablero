'use strict'

const uuid = require('uuid')
const domify = require('domify')
const id = uuid.v4()
const io = require('socket.io-client')
const socket = io.connect()

var documento=document.querySelector('document')
var ventana = document.querySelector('window')
var tablero = document.querySelector('#tablero')
var conectados=document.querySelector('#conectados')
var instrucciones=document.querySelector('#instrucciones')
var cursor = document.querySelector('#cursores')

var ctx = tablero.getContext('2d')

var dibujando = false;
var usuarios = {};
var cursores = {};
var prev = {};
var ultConexion = new Date().getTime();
var cursorColor = randomColor();

socket.on('conexiones',function(data){
	console.log('conexiones',data.conectados);
	conectados.innerHTML=data.conectados+" conectados";
})

socket.on('mover',moverlo)

function moverlo(data){
	if(!(data.id in usuarios)){
		cursores[data.id] = cursor.appendChild(domify('<div class="cursor"></div>'))
	}
	
	cursores[data.id].style.top=data.y+"px"
	cursores[data.id].style.left=data.x+"px"

	if(data.dibujando && usuarios[data.id])drawLine(usuarios[data.id].x, usuarios[data.id].y, data.x, data.y, data.color);

	usuarios[data.id]=data
	usuarios[data.id].ultVez = new Date().getTime()
}





tablero.addEventListener('mousedown',function(e){
	e.preventDefault();
	dibujando=true;
    prev.x = e.pageX;
    prev.y = e.pageY;
	instrucciones.style.display='none';
},false)

document.onmousemove= function(e){
	if((new Date().getTime() - ultConexion)>30){
		var movimiento ={
			"y":e.pageY,
			"x":e.pageX,
			"dibujando":dibujando,
			"color":cursorColor,
			"id":id
		}
		socket.emit('moverMouse',movimiento);
		ultConexion=new Date().getTime();
	}
	if(dibujando){
		drawLine(prev.x, prev.y, e.pageX, e.pageY, cursorColor);
		prev.x=e.pageX;
		prev.y=e.pageY;
	}
}

document.onmouseup=function(e){
	dibujando=false
}
document.onmouseleave=function(e){
	dibujando=false
}

function drawLine(fromx, fromy, tox, toy, color){
    ctx.beginPath(); // create a new empty path (no subpaths!)
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
  }

function randomColor() {
// from http://www.paulirish.com/2009/random-hex-color-code-snippets/
return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
(c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);
}

setInterval(function(){
    for(var ident in usuarios){
      if((new Date().getTime() - usuarios[ident].ultVez) > 10000){
      	console.log(usuarios[ident])
        cursor.appendChild(cursores[ident])
        delete usuarios[ident];
        delete cursores[ident];
      }
    }
  },10000);