import AuthService from '@/services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { status: { loggedIn: true }, user } : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('genericResult');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('genericResult');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('genericResult');
          return Promise.resolve(response.data);
        },
        error => {
          commit('genericResult');
          return Promise.reject(error);
        }
      );
    },
    confirm({ commit }, data) {
      return AuthService.confirm(data).then(
        response => {
          commit('genericResult');
          return Promise.resolve(response.data);
        },
        error => {
          commit('genericResult');
          return Promise.reject(error);
        }
      );
    },
    generate({ commit }, data) {
        return AuthService.generate(data).then(
          response => {
            commit('genericResult');
            return Promise.resolve(response.data);
          },
          error => {
            commit('genericResult');
            return Promise.reject(error);
          }
        );
    },
    reset({ commit }, data) {
        return AuthService.reset(data).then(
          response => {
            commit('genericResult');
            return Promise.resolve(response.data);
          },
          error => {
            commit('genericResult');
            return Promise.reject(error);
          }
        );
    },
    forgot({ commit }, data) {
        return AuthService.forgot(data).then(
          response => {
            commit('genericResult');
            return Promise.resolve(response.data);
          },
          error => {
            commit('genericResult');
            return Promise.reject(error);
          }
        );
    },
    profile({ commit }, user) {
      return AuthService.profile(user).then(
        user => {
          commit('profileSucess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('genericResult');
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    loginSuccess(state, user) {
        state.status.loggedIn = true;
        state.user = user;
    },
    profileSucess(state, user) {
        state.status.loggedIn = true;
        state.user = user;
    },
    genericResult(state) {
        state.status.loggedIn = false;
        state.user = null;
    }
  }
};