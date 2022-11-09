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
    sharedFreets: [], // all shared freets
    sharedFreetsForFeed: [], // shared freets for feed
    sharedFreetsForExplore: [], // shared freets for explore (other shared freets)
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
    setUserId(state, id) {
      /**
       * Update the stored userId to the specified one.
       * @param id - new userId to set
       */
      state.userId = id;
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
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
    updateSharedFreets(state, sharedFreets) {
      /**
       * Update the stored freets to the provided freets.
       * @param sharedFreets - Freets to store
       */
      state.sharedFreets = sharedFreets;
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
    async refreshSharedFreets(state) {
      
      const url = state.filter ? `/api/sharedFreets?author=${state.filter}` : '/api/sharedFreets';
      const res = await fetch(url).then(async r => r.json());
      state.sharedFreets = res;

      if (state.filter){
        const url_feed = `/api/sharedFreets?author=${state.filter}`;
        const res_feed = await fetch(url_feed).then(async r => r.json());
        state.sharedFreetsForFeed = res_feed;
      }
      else{
        const url_feed_1 = `/api/sharedFreets?author=${state.username}`;
        const res_feed_1 = await fetch(url_feed_1).then(async r => r.json());
        const url_feed_2 = '/api/sharedFreets/feed';
        const res_feed_2 = await fetch(url_feed_2).then(async r => r.json());
        state.sharedFreetsForFeed = [...res_feed_1, ...res_feed_2];
      }
      
      const url_explore = '/api/sharedFreets/explore';
      const res_explore = await fetch(url_explore).then(async r => r.json());
      state.sharedFreetsForExplore = res_explore;
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