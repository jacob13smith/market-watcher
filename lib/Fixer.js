const axios = require('axios');

/**
 * Static class for making calls to Fixer.io API.
 */
class Fixer {

	/**
	 * Get f(x) rates from fixer.io.
	 */
	static async getRates() {
		if (process.env.FIXER_KEY === undefined) {
			return { pass: false, data: 'Please setup Fixer.io key in environment.'};
		}
		try {
			let response = await axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.FIXER_KEY}&symbols=USD,CAD`);
			if ( response.data.success === true ) {
				return { pass: true, data: response.data.rates };
			} else {
				return { pass: false, data: response.data };
			}
		} catch(err) {
			return { pass: false, data: 'Problem making axios request to Fixer.io'};
		}
	}
}

module.exports = Fixer;
