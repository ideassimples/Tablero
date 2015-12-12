const st = require('st')
const curso = require('course')
const path = require('path')

const enrutador = curso()

const monto=st({
	path:path.join(__dirname,'..','publico'),
	index:'index.html',
	passthrough:true
})

module.exports=arranque

function arranque(req,res){
	if(req.url.startsWith('/socket.io'))return
		monto(req,res,function(err){
			if(err)console.error(err.message)

			enrutador(req,res,function(err){
				if(err)fallo(res,err)
				res.statusCode=400
				res.end(`No se encontro la pagina ${req.url}`)
			})
		})
}

function fallo(err,res){
	res.statusCode= 500
	res.setHeader('Content-type','text/plain')
	res.end(err.message)
}