const WebSocketServer = require('./lib/websocket-server')
const WebsocketConnect = require('./lib/ws')
const http = require('http')
const fs = require('fs')
const path = require('path')

const wss = new WebSocketServer({ port: 8888 })

//WebsocketConnect()

const obj = {
  jsonrpc: '2.0',
  method: 'newDiag',
  params: {
    tree_id: '0_0', //故障树id
    name: 'zdj9双牵外锁道岔失表_牵引点故障_电气故障',
    time: '2023-10-13 09:46:48',
    node_id: '2_1', //树的节点id
    state: '1', //故障节点是否被触发
    dc_state: '0',
    loc_param: {
      //触发位置参数
      line_id: '三号线', //线路id
      station_id: '青龙基地站', //车站id
      dc_id: 'D0301', //道岔id
      zzj_id: 'D0301J1', //转辙机id   故障点不属于转辙机则为空串
    },
    data_param: {
    },
  },
}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received: ' + message)
    ws.send(JSON.stringify(obj))
  })

  ws.on('close', () => {
    console.log('Connection closed')
  })

  ws.send('Hello! Message from server')
})

const server = http.createServer((req, res) => {
  const filePath = path.join(
    __dirname,
    'public',
    req.url === '/' ? 'index.html' : req.url
  )
  const extname = path.extname(filePath)

  let contentType = 'text/html'
  switch (extname) {
    case '.js':
      contentType = 'text/javascript'
      break
    case '.css':
      contentType = 'text/css'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.jpg':
      contentType = 'image/jpg'
      break
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        fs.readFile(
          path.join(__dirname, 'public', '404.html'),
          (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(content, 'utf8')
          }
        )
      } else {
        res.writeHead(500)
        res.end(`Server Error: ${err.code}`)
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content, 'utf8')
    }
  })
})

server.listen(3000, () => {
  console.log('Server is running on port 3000')
})
