const https = require('https')

function getFoodNames(text) {
    return new Promise((resolve, reject) => {
        let url = 'https://fineli.fi/fineli/api/v1/foods?q=' + text
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

                let names = []
                parsedData.forEach((obj) => { names.push([obj.name.fi, obj.id]) })
                resolve(names)
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    }
    )
}

export default function handler(req, res) {
    let searchTerm = req.body.query
    getFoodNames(searchTerm).then((value) => res.send(value))
}