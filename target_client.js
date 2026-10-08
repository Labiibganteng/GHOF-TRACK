const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3000');

const deviceId = 'TARGET_DEVICE_001';

ws.on('open', function open() {
    console.log('Perangkat target terhubung ke server GHOF TRACK');
    
    // Mendaftarkan perangkat ini sebagai 'target'
    ws.send(JSON.stringify({
        type: 'REGISTER',
        role: 'target',
        deviceId: deviceId
    }));
});

ws.on('message', function incoming(data) {
    try {
        const command = JSON.parse(data);
        console.log('Perintah diterima dari Parent:', command);

        if (command.action === 'OPEN_CAMERA') {
            console.log('Mengaktifkan kamera secara live...');
            // Di sinilah nanti fungsi kamera HP target dijalankan
        }
    } catch (error) {
        console.error('Gagal memproses perintah:', error);
    }
});
