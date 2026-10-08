const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

let clients = {
    parents: {},
    targets: {}
};

wss.on('connection', (ws) => {
    console.log('Koneksi baru terdeteksi.');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // Pendaftaran perangkat
            if (data.type === 'REGISTER') {
                if (data.role === 'parent') {
                    clients.parents[data.deviceId] = ws;
                    console.log(`Parent terdaftar: ${data.deviceId}`);
                } else if (data.role === 'target') {
                    clients.targets[data.deviceId] = ws;
                    console.log(`Target terdaftar: ${data.deviceId}`);
                }
            }

            // Meneruskan perintah dari Parent ke Target
            if (data.type === 'COMMAND') {
                const targetWs = clients.targets[data.targetId];
                if (targetWs && targetWs.readyState === ws.OPEN) {
                    targetWs.send(JSON.stringify(data.payload));
                    console.log(`Mengirim perintah ke target: ${data.targetId}`);
                }
            }

            // Meneruskan data stream dari Target kembali ke Parent
            if (data.type === 'DATA_STREAM') {
                const parentWs = clients.parents[data.parentId];
                if (parentWs && parentWs.readyState === ws.OPEN) {
                    parentWs.send(JSON.stringify(data.payload));
                }
            }

        } catch (error) {
            console.error('Format pesan salah:', error);
        }
    });

    ws.on('close', () => {
        console.log('Koneksi terputus.');
        for (let id in clients.parents) {
            if (clients.parents[id] === ws) delete clients.parents[id];
        }
        for (let id in clients.targets) {
            if (clients.targets[id] === ws) delete clients.targets[id];
        }
    });
});

app.get('/', (req, res) => {
    res.send('GHOF TRACK Server is running smoothly!');
});

server.listen(PORT, () => {
    console.log(`Server GHOF TRACK aktif di port ${PORT}`);
});
                  
