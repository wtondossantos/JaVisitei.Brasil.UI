
import axios from 'axios';

const axiosHttp = axios.create({
  baseURL: import.meta.env.VITE_URL_API_MAPA_JAVISITEI
});

axiosHttp.interceptors.request.use(async (config) => {
    config.headers['Content-Type'] = 'application/json';
    
    const accessToken = JSON.parse(localStorage.getItem('token'));
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosHttp.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  if (error.response?.status === 401) {
    const originalRequest = error.config;
    const rToken = JSON.parse(localStorage.getItem('rtoken'));
    const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && rToken && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await getRefreshToken(rToken, refreshToken, user);
        const accessToken = JSON.parse(localStorage.getItem("token"));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosHttp(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('rtoken');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        throw refreshError;
      }
    }
  }
  return Promise.reject(error);
});

async function getRefreshToken(rToken, refreshToken, user) {
  try {
    const data = {
      email: user.email,
      rToken: rToken,
      refreshToken: refreshToken
    }
    const response = await axios.post(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}profiles/refresh_token`, data, {
              headers:{'Content-type': 'application/json', Authorization: `Bearer ${rToken}`}
            });

    localStorage.setItem("refresh_token", JSON.stringify(response.data.data.refresh_token));
    localStorage.setItem("rtoken", JSON.stringify(response.data.data.rtoken));
    localStorage.setItem("token", JSON.stringify(response.data.data.token));
    user.token = response.data.data.token;
    localStorage.setItem("user", JSON.stringify(user));

  } catch (error) {
    throw error;
  }
}

export default axiosHttp;