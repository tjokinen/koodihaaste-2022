const https = require('https')

function getFoodData(id) {
    return new Promise((resolve, reject) => {
        let url = 'https://fineli.fi/fineli/api/v1/foods/' + id
        https.get(url, res => {
            let data = [];
            const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            console.log('Status Code:', res.statusCode);
            console.log('Date in Response header:', headerDate);

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                console.log('Response ended: ');
                const parsedData = JSON.parse(Buffer.concat(data).toString());

                resolve([parsedData.name.fi,
                parsedData.id,
                parsedData.energy,
                parsedData.carbohydrate,
                parsedData.protein,
                parsedData.fat])
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    }
    )
}

export default function handler(req, res) {
    getFoodData(req.body.foodCode).then((value) => res.send(value))
}