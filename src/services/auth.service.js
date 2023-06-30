import axios from 'axios';

class AuthService {
    login(data) {
        return axios.post(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}profiles/login`, data)
            .then(response => {
                if (response.data.data.token) {
                    localStorage.setItem('token', JSON.stringify(response.data.data.token));
                    localStorage.setItem('rtoken', JSON.stringify(response.data.data.rtoken));
                    localStorage.setItem('refresh_token', JSON.stringify(response.data.data.refresh_token));
                    
                    return axios.get(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}users/${response.data.data.id}`, {
                        headers: {
                            Authorization: `Bearer ${response.data.data.token}`,
                        },
                    })
                    .then(resp => {
                        const userResponse = { 
                            id: resp.data.id,
                            securityStamp: resp.data.security_stamp,
                            email: resp.data.email,
                            name: resp.data.name,
                            surname: resp.data.surname,
                            username: resp.data.username, 
                            token: response.data.data.token
                        };

                        if (userResponse.id) {
                            localStorage.setItem('user', JSON.stringify(userResponse));
                        }

                        return userResponse;
                    });
                }
            });
    }
    
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('rtoken');
        localStorage.removeItem('refresh_token');
    }

    register(data) {
        return axios.post(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}users`, data);    }

    confirm(data) {
        return axios.post(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}profiles/active_account/${data.code}`);
    }

    generate(data) {
        return axios.post(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}profiles/generate_confirmation_code/${data.email}`);
    }

    reset(data){
        return axios.post(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}profiles/reset_password`, data);
    }

    forgot(data){
        return axios.post(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}profiles/forgot_password/${data.email}`);
    }

    profile(data){
        return axios.put(`${import.meta.env.VITE_URL_API_MAPA_JAVISITEI}users`, data);
    }
}

export default new AuthService();