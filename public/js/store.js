import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		activeTab: 'default',
		transition: 'fade' // slide-in
	},
	getters: {},
	mutations: {},
	actions: {}
});
