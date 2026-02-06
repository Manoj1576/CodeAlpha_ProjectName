const https = require('https');
const fs = require('fs');
const path = require('path');

const download = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                download(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

const targets = [
    { brand: 'yamaha', id: 14, keywords: 'motorcycle,racing,blue', lock: 999 }, // New lock
    { brand: 'pulsar', id: 2, keywords: 'motorcycle,street,custom', lock: 888 }, // New lock
    { brand: 'pulsar', id: 3, keywords: 'motorcycle,bike,speed', lock: 777 }  // New lock
];

(async () => {
    for (const t of targets) {
        const url = `https://loremflickr.com/800/600/${t.keywords}?lock=${t.lock}`;
        const filepath = path.join(__dirname, 'images', t.brand, `bike${t.id}.jpg`);
        console.log(`Downloading new image for ${t.brand} bike${t.id}...`);
        try {
            await download(url, filepath);
            console.log(`Updated ${t.brand}/bike${t.id}.jpg`);
        } catch (e) {
            console.error(`Error ${t.brand}/bike${t.id}:`, e.message);
        }
    }
})();
