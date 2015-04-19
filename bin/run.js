var finalhandler = require('finalhandler')
var http = require('http')
var serveIndex = require('serve-index-prefix')
var serveStatic = require('serve-static')

var path = require('path')
var url = require('url');

var config = require('./config.json')
var pathMap = config['path']
var onlyStatic = config.onlyStatic


if(typeof pathMap === 'undefined') {
    pathMap = {}
} else {
    var tempPathMap = {}
    for(var tempPrefixPath in pathMap) {
        if(tempPrefixPath[tempPrefixPath.length-1] !== '/') {
            tempPathMap[tempPrefixPath + '/'] = pathMap[tempPrefixPath]
        } else {
            tempPathMap[tempPrefixPath] = pathMap[tempPrefixPath]
        }
    }
    pathMap = tempPathMap
}

var indexMap = {},
    serveMap = {},
    prefixRegExpMap = {}

for(var tempPath in pathMap) {
    indexMap[tempPath] = serveIndex(pathMap[tempPath], {"icons": true, "hidden": false, "view": "details"})
     
    serveMap[tempPath] = serveStatic(pathMap[tempPath], {"index": false})

    prefixRegExpMap[tempPath] = new RegExp('^' + tempPath)

}


var homeDir = ''
if(pathMap['/'] === undefined) {
    var tempRoot = process.cwd()
    indexMap['/'] = serveIndex(tempRoot, {"icons": true, "hidden": false, "view": "details"})
     
    serveMap['/'] = serveStatic(tempRoot, {"index": false})

    prefixRegExpMap['/'] = new RegExp('^/')

    pathMap['/'] = tempRoot

    homeDir = tempRoot
} else {
    homeDir = pathMap['/']
}


// Create server 
var server = http.createServer(function onRequest(req, res){
    req.url = _normPath(req.url)

    var flag = true
    for(var prefixPath in pathMap) {
        if(prefixPath !== '/') {
            if(prefixRegExpMap[prefixPath].exec(req.url) !== null) {
                serveIndexRespone(req, res, prefixPath)
                flag = false
                break
            }
        }
    }

    if(flag) {
        serveIndexRespone(req, res, '/')
    }

})

function _normPath(path) {
    var lastPart = path.split('/').pop()
    if(lastPart.length > 0) {
        if(lastPart.split('.').length === 1 || parseInt(lastPart.split('.').pop()).toString() !== 'NaN') {
            path = path + '/'
        }
    }
    return path
}

function serveIndexRespone(req, res, prefixPath) {
    var done = finalhandler(req, res)

    req.url =  '/' + req.url.replace(prefixRegExpMap[prefixPath], '')
    if(prefixPath === '/') {
        req.prefixPath = ''
    } else {
        req.prefixPath = prefixPath
    }
    console.log(req.url)
    console.log(req.prefixPath)


    serveMap[prefixPath](req, res, function onNext(err) {
        if (err) return done(err)
        if(!onlyStatic) {
            indexMap[prefixPath](req, res, done)
        } else {
            done()
        }
    })
}
 
// Listen
var port = config.port || 3000
server.listen(port, function() {
    console.log('--------------------------------------------')
    console.log('-                                          -')
    console.log('-                                          -')
    console.log('-     light static server start at '+ port +'    -')
    console.log('-                                          -')
    console.log('-                                          -')
    console.log('--------------------------------------------')
})