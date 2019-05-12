/**
 * General Vue Components
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '../components/App.vue';
import { store } from './store';
import { routes } from './routes';
import vSelect from 'vue-select';
import Loader from '../components/general/Loader.vue';
import Switch from '../components/general/Switch.vue';
import Default from '../components/Default.vue';
import axios from 'axios';

Vue.component('v-select', vSelect);
Vue.component('default', Default);
Vue.component('loader', Loader);
Vue.component('switch', Switch);

Vue.use(VueRouter);
const router = new VueRouter({
	routes,
	mode: 'history'
});

/**
 * General Axios Settings
 */
axios.interceptors.response.use(response => {
	if (response.status <= 300 && response.status >= 200) {
		return response.data;
	}
	console.log('Error in response returned');
	return {};
});


/**
 * General Vue Filter(s)
 */
Vue.filter('capitalize', word => {
	let cap = word;
	if (!cap) return '';
	cap = cap.toString();
	return cap.charAt(0).toUpperCase() + cap.slice(1);
});

require('../scss/public.scss');
require('../scss/private.scss');
require('./private.js');

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
});
