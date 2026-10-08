const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3000');

const deviceId = 'PARENT_DEVICE_001';
const targetId = 'TARGET_DEVICE_001';

ws.on('open', function open() {
    console.log('Aplikasi Parent terhubung ke server GHOF TRACK');
    
    // Mendaftarkan perangkat ini sebagai 'parent'
    ws.send(JSON.stringify({
        type: 'REGISTER',
        role: 'parent',
        deviceId: deviceId
    }));

    // Contoh: Mengirim perintah untuk membuka kamera ke target setelah 3 detik
    setTimeout(() => {
        console.log('Mengirim perintah BUKA KAMERA ke target...');
        ws.send(JSON.stringify({
            type: 'COMMAND',
            targetId: targetId,
            payload: {
                action: 'OPEN_CAMERA'
            }
        }));
    }, 3000);
});

ws.on('message', function incoming(data) {
    console.log('Menerima data stream/balasan dari target:', data);
});
