const https = require('https');
const fs = require('fs');
const path = require('path');

const { URL } = require('url');

const download = (urlStr, filepath, redirectCount = 0) => {
    if (redirectCount > 5) return Promise.reject(new Error('Too many redirects'));

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);

        let requestUrl;
        try {
            requestUrl = new URL(urlStr);
        } catch (e) {
            return reject(e);
        }

        https.get(requestUrl, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
                file.close();
                fs.unlink(filepath, () => { }); // Clean up

                const location = response.headers.location;
                if (!location) return reject(new Error('Redirect with no location'));

                const nextUrl = new URL(location, urlStr).toString();
                return download(nextUrl, filepath, redirectCount + 1).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => { });
                return reject(new Error(`Status ${response.statusCode}`));
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            file.close();
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

const brands = {
    'yamaha': 'motorcycle,blue,sportbike',
    'pulsar': 'motorcycle,white,streetfighter',
    'tvs': 'motorcycle,red,racing'
};

(async () => {
    for (const [brand, keywords] of Object.entries(brands)) {
        const dir = path.join(__dirname, 'images', brand);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        console.log(`Downloading for ${brand}...`);

        for (let i = 1; i <= 15; i++) {
            // Use LoremFlickr with lock for consistency and variety
            // Add a random timestamp to ensure no caching at any level if lock fails
            const url = `https://loremflickr.com/800/600/${keywords}?lock=${i + (brand === 'yamaha' ? 100 : 200)}`;
            const filepath = path.join(dir, `bike${i}.jpg`);

            try {
                await download(url, filepath);
                console.log(`Saved ${brand}/bike${i}.jpg`);
            } catch (e) {
                console.error(`Failed ${brand}/bike${i}.jpg`, e.message);
            }
        }
    }
})();
