import axios from 'axios';
import Home from '../components/Home.vue';

export const routes = [
	{
		path: '/',
		name: 'home',
		components: {
			default: Home
		}
	},
	{
		path: '*',
		redirect: '/'
	}
];
