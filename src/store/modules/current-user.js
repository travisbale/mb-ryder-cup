import axios from '@/lib/axios';

const anonymousUser = {
  roles: [],
  permissions: [],
};

export default {
  namespaced: true,

  state: {
    currentUser: anonymousUser,
  },

  getters: {
    isLoggedIn(state) {
      return state.currentUser.email != null;
    },

    isAdmin(state) {
      return state.currentUser.roles.includes('Administrator');
    },
  },

  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
  },

  actions: {
    login({ commit }, credentials) {
      return axios.post('login', credentials).then((response) => {
        commit('setCurrentUser', response.data);
      });
    },

    refresh({ getters, commit }) {
      const config = { xsrfCookieName: 'csrf_refresh_token' };

      if (!getters.isLoggedIn) {
        const refreshing = axios.post('refresh', null, config);

        refreshing
          .then((response) => { commit('setCurrentUser', response.data); })
          .catch(() => { commit('setCurrentUser', anonymousUser); });

        return refreshing;
      }

      return Promise.resolve();
    },

    logout({ commit }) {
      return axios.delete('logout').then(() => {
        commit('setCurrentUser', anonymousUser);
      });
    },

    register({ commit }, credentials) {
      return axios.post('register', credentials).then((response) => {
        commit('setCurrentUser', response.data);
      });
    },
  },
};
