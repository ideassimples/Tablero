const http = require('http')
const enrutador = require('./router')
const puerto = process.env.PORT || 8080;
const realtime = require('./real')

const servidor = http.createServer();

realtime(servidor);
servidor.on('request',enrutador)
servidor.on('listening',escuchando)
servidor.listen(puerto);

function escuchando(){
	console.log(`Iniciando en el puerto ${puerto}`);
}
