import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // all freets
    freetsForFeed: [], // freets for feed
    freetsForExplore: [], // freets for explore (other freets)
    comments: [],
    username: null, // Username of the logged in user
    userId: null, // User id of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
      
      const url_feed = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets/feed';
      const res_feed = await fetch(url_feed).then(async r => r.json());
      state.freetsForFeed = res_feed;
      
      const url_explore = '/api/freets/explore';
      const res_explore = await fetch(url_explore).then(async r => r.json());
      state.freetsForExplore = res_explore;
    },
    async refreshComments(state){
      const url = state.filter ? `/api/comments?parentContentId=${state.filter}` : null;
      const res = await fetch(url).then(async r => r.json());
      state.comments = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;