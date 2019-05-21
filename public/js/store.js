import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		activeTab: 'default',
		transition: 'fade' // slide-in
	},
	getters: {
		activeTab(state) { return state.activeTab; },
		transition(state) { return state.transition; }
	},
	mutations: {},
	actions: {}
});
