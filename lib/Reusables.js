var path = require('path');
var root = path.dirname(require.main.filename);

var DBHandler = require(`${root}/lib/DBHandler`);
const dp = 5;

module.exports = {
	addToProfits(tickerA, tickerB, profits, market, unique) {
		if (tickerA.buy < tickerB.sell) {
			let diff = tickerB.sell - tickerA.buy;
			let id = tickerA.exchange + tickerB.exchange + market;
			if (diff > 0.0001 && unique.indexOf(id) === -1) {
				profits[market].push({
					market: market,
					buyFrom: tickerA.exchange.toLowerCase(),
					sellTo: tickerB.exchange.toLowerCase(),
					buyFor: tickerA.buy,
					sellFor: tickerB.sell,
					diff: diff,
					diffPercent: diff / tickerA.buy * 100,
					uid: id // Needed for front-ned Vue :key
				});
				unique.push(id);
			}
		}
	},
	getTickerObj(ticker, ex) {
		let bFee = ticker.ask * ex[ticker.trade.toLowerCase()].settings.rates.bRate;
		let sFee = ticker.bid * ex[ticker.trade.toLowerCase()].settings.rates.sRate;
		return {
			exchange: ticker.trade,
			buy: parseFloat((ticker.ask + bFee)).toFixed(dp),
			sell: parseFloat((ticker.bid - sFee)).toFixed(dp)
		};
	},
	structureBookOrders(exchange, market, bookOrders) {
		let results = {
			...bookOrders
		};
		if (exchange in results) {
			if (!(market in results[exchange])) {
				results[exchange][market] = {};
			}
		} else {
			results[exchange] = {};
			results[exchange][market] = {};
		}
		return results;
	},
	addAllToProfits(hasAll, profits) {
		let results = {
			...profits
		};
		if (!hasAll) {
			return profits;
		}
		results.all = [];
		let sort = (a, b) => {
			return b.diffPercent - a.diffPercent;
		};
		let concatAll = (profit) => {
			results.all = results.all.concat(profit[1]);
			results[profit[0]].sort(sort);
		};
		Object.entries(profits).forEach(concatAll);
		results.all.sort(sort);
		return results;
	},
	getUserSettings(userMeta) {
		let settings = {};
		userMeta.forEach(meta => {
			let value = meta.metaValue;
			let replace = meta.metaName.replace('setting_', '');
			if (meta.stringified === 'true') {
				value = JSON.parse(value);
			}
			settings[replace] = value;
		});
		return settings;
	},
	updateUserSettings(settings, username, prefix) {
		return new Promise(async resolve => {
			let promises = [];
			Object.entries(settings).forEach(setting => {
				let value = setting[1];
				let stringified = false;
				if (setting[1].constructor === Array || setting[1].constructor === Object) {
					value = JSON.stringify(value);
					stringified = true;
				}
				let find = {
					user: username,
					metaName: prefix + setting[0]
				};
				let doc = {
					...find,
					metaValue: value,
					stringified: stringified
				};
				promises.push(DBHandler.updateDocument('UserMeta', find, doc));
			});
			let results = await Promise.all(promises);
			resolve(results);
		});
	}
};
