import http from '@/services/http.js';

class UserService {
  getPublicContent() {
    return http.get(`all`);
  }

  getUserBoard() {
    return http.get(`user`);
  }

  getModeratorBoard() {
    return http.get(`mod`);
  }

  getAdminBoard() {
    return http.get(`admin`);
  }
}

export default new UserService();