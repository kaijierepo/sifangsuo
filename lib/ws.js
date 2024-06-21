const http = require('http')
const crypto = require('crypto')

const options = {
  port: 667,
  headers: {
    Connection: 'Upgrade',
    Upgrade: 'websocket',
    'Sec-WebSocket-Key': crypto.randomBytes(16).toString('base64'),
    'Sec-WebSocket-Version': '13',
  },
}

function parseWebSocketFrame(data) {
  const masked = (data[1] & 0x80) === 0x80
  let payloadLength = data[1] & 0x7f
  let mask
  let payloadData

  if (payloadLength === 126) {
    payloadLength = data.readUInt16BE(2)
    // mask = data.slice(4, 8);
    payloadData = data.slice(4)
  } else if (payloadLength === 127) {
    payloadLength =
      data.readUInt32BE(2) * Math.pow(2, 32) + data.readUInt32BE(6)
    mask = data.slice(10, 14)
    payloadData = data.slice(14)
  } else {
    mask = data.slice(2, 6)
    payloadData = data.slice(6)
  }

  if (masked) {
    for (let i = 0; i < payloadData.length; i++) {
      payloadData[i] ^= mask[i % 4]
    }
  }

  return payloadData.toString('utf8')
}

function WebsocketConnect() {
  return new Promise((resolve, reject) => {
    const req = http.request(options)
    req.end()

    req.on('upgrade', (res, socket, upgradeHead) => {
      console.log('Connection upgraded to WebSocket')

      socket.on('data', (data) => {
        const message = parseWebSocketFrame(data)
        console.log('Received: ' + message)
      })

      socket.on('close', () => {
        console.log('Connection closed, reconnecting...')
        WebsocketConnect()
      })

      resolve(socket)
    })

    req.on('error', (err) => {
      console.error('Error: ', err)
      reject(err)
    })
  })
}

module.exports.WebsocketConnect = WebsocketConnect
module.exports.parseWebSocketFrame = parseWebSocketFrame