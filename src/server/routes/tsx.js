var express = require('express');
var router = express.Router();
const axios = require('axios');
var fs = require('fs');
var HTMLParser = require('node-html-parser');
const csv = require('csv-parser')

// This is a test endpoint for framework purposes.
router.get('/', async( req, res ) => {
    var symbols = [];
    fs.createReadStream('./src/server/lib/S&PTSX.csv')
    .pipe(csv())
    .on('data', (data) => symbols.push(data))
    .on('end', () => {
        var entries = [];
        var promises = [];
        for (i = 0; i < symbols.length; i++){
            let temp = symbols[i].Symbol;
            let name = symbols[i].Name;
            promises.push(new Promise(function(resolve, reject) {
                return axios.all([getStats(temp), getQuote(temp)])
                .then(axios.spread(function (statsResponse, quoteResponse){
                    let page = HTMLParser.parse(quoteResponse.data);
                    let quote = "Not Found";
                    try {
                        quote = page.querySelector('span.nasdaqChangeHeader').parentNode.childNodes[6].childNodes[0].rawText.trim();
                    } catch (err){
                    }
                    let root = HTMLParser.parse(statsResponse.data)
                    let eps = find(root, "Diluted EPS");
                    let bvps = find(root, "Book Value Per Share").replace(",","");
                    let eval = eps * bvps;
                    if (eps == "N/A" || bvps == "N/A"){
                        eval = "Unknown";
                    } else if (eval < 0){
                        eval = "Negative"
                    } else {
                        eval = Math.sqrt(22.5 * eps * bvps).toFixed(2);
                    }
                    resolve({
                        symbol: temp,
                        name: name,
                        quote: quote,
                        graham: eval
                    });
                }));
            }));
        }
        Promise.all(promises).then(function (responses){
            fs.writeFile("./output.txt", JSON.stringify(responses));
            res.json(responses);
        });
    });
});

function find(root, field){
    var rows = root.querySelectorAll('tr');
    for (i = 0; i < rows.length; i++){
        if (rows[i].firstChild.firstChild.text == field){
            return rows[i].lastChild.text;
        }
    }
}

function getStats(symbol){
    return axios({
        method: 'get',
        url:  `https://ca.finance.yahoo.com/quote/${symbol}/key-statistics?p=${symbol}`
    });
}

function getQuote(symbol){
    symbol = symbol.replace("-","");
    return axios({
        method: 'get',
        url: `https://www.reuters.com/finance/stocks/overview/${symbol}`
    })
}

module.exports = router;