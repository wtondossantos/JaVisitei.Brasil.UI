<template>
    <div id="content">
        <h3><font-awesome-icon icon="user" /> {{content}}</h3>
        <div v-if="message" role="alert" class="alert" :class="alertSuccess ? 'alert-success' : 'alert-danger'">
            {{ message }}
        </div>
        <Form @submit="handleProfile" :validation-schema="schema" autocomplete="off">
            <Field name="id" v-model="currentUser.id" type="hidden" aria-hidden="true"/>
            <Field name="securityStamp" v-model="currentUser.securityStamp" type="hidden" aria-hidden="true"/>
            <div>
                <label for="username" style="display:none">Username</label>
                <Field name="username" v-model="currentUser.username" type="text" placeholder="Username"/>
                <ErrorMessage name="username" class="error-feedback" />
            </div>
            <div class="group">
                <div>
                    <label for="name" style="display:none">Nome</label>
                    <Field name="name" v-model="currentUser.name" type="text" placeholder="Nome"/>
                    <ErrorMessage name="name" class="error-feedback" />
                </div>
                <div>
                    <label for="surname" style="display:none">Sobrenome</label>
                    <Field name="surname" v-model="currentUser.surname" type="text" placeholder="Sobrenome"/>
                    <ErrorMessage name="surname" class="error-feedback" />
                </div>
            </div>
            <div class="group">
                <div>
                    <label for="email" style="display:none">E-mail</label>
                    <Field name="email" v-model="currentUser.email" type="email" placeholder="E-mail"/>
                    <ErrorMessage name="email" class="error-feedback" />
                </div>
                <div>
                    <label for="reEmail" style="display:none">Confirmar e-mail</label>
                    <Field name="reEmail" type="email" v-model="currentUser.email" placeholder="Confirmar e-mail"/>
                    <ErrorMessage name="reEmail" class="error-feedback" />
                </div>
            </div>
            <div class="group">
                <div>
                    <label for="password" style="display:none">Nova senha</label>
                    <Field name="password" type="password" placeholder="Nova senha"/>
                    <ErrorMessage name="password" class="error-feedback" />
                </div>
                <div>
                    <label for="rePassword" style="display:none">Confirmar nova senha</label>
                    <Field name="rePassword" type="password" placeholder="Confirmar nova senha"/>
                    <ErrorMessage name="rePassword" class="error-feedback" />
                </div>
            </div>
            <div class="group">
                <div>
                    <label for="oldPassword" style="display:none">Senha antiga</label>
                    <Field name="oldPassword" type="password" placeholder="Senha antiga" maxlength="20"/>
                    <ErrorMessage name="oldPassword" class="error-feedback" />
                </div>
            </div>
            <button>
                <font-awesome-icon icon="sign-in-alt" /> Atualizar
            </button>
        </Form>
  </div>
</template>

<script>
    import { Form, Field, ErrorMessage } from "vee-validate";
    import * as yup from "yup";
	import http from '@/services/http.js';

export default {
  name: 'Profile',
    components: {
      Form,
      Field,
      ErrorMessage,
    },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
    data() {
        const schema = yup.object().shape({
            username: yup
                .string()
                .required("Username obrigatório.")
                .min(3, "Mínimo 3 caracteres.")
                .max(25, "Máximo 25 caracteres."),
            surname: yup
                .string()
                .max(150, "Máximo 150 caracteres."),
            name: yup
                .string()
                .required("Nome obrigatório.")
                .min(3, "Mínimo 3 caracteres.")
                .max(50, "Máximo 50 caracteres."),
            email: yup
                .string()
                .required("E-mail obrigatório.")
                .email("E-mail inválido.")
                .max(100, "Máximo 100 caracteres."),
            reEmail: yup
                .string()
                .required("Confirme o E-mail.")
                .email("E-mail inválido.")
                .max(100, "Máximo 100 caracteres."),
            password: yup
                .string()
                .max(20, "Máximo 20 caracteres."),
            rePassword: yup
                .string()
                .max(20, "Máximo 20 caracteres."),
            oldPassword: yup
                .string()
                .max(20, "Máximo 20 caracteres."),
                });
        
        return {
            message: '',
            schema,
            content: "Perfil",
            alertSuccess: false,
        };
    },
    mounted() {
        if (!this.currentUser) {
            this.$router.push('/login');
        }
    },
    methods: {
        handleProfile(data) {
            this.message = '';
            http.put('users', data)
                .then((response) => {
                    this.message = response.data.message;
                    this.alertSuccess = true;
                    
                    const userResponse = { 
                        id: response.data.data.id,
                        securityStamp: response.data.data.security_stamp,
                        email: response.data.data.email,
                        name: response.data.data.name,
                        surname: response.data.data.surname,
                        username: response.data.data.username, 
                        token: JSON.parse(localStorage.getItem("token"))
                    };

                    if (userResponse.id) {
                        localStorage.setItem('user', JSON.stringify(userResponse));
                        this.$store.state.auth.user = JSON.parse(localStorage.getItem('user'));
                    }

                    Promise.resolve(response.data);
                })
				.catch((error) => {
                    if(error.response &&
                        error.response.data &&
                        error.response.data.errors && 
                        (error.response.data.errors.Message || 
                        error.response.data.errors.$values))
                    {
                        if(error.response.data.errors.Message)
                            this.message = error.response.data.errors.Message;
                        else
                            error.response.data.errors.$values.forEach(item => {
                                this.message = `${this.message} ${item}`;
                            });
                    }
                    else if(error.message)
                    {
                        this.message = error.message;
                    }
                    else if(error.response.data.message)
                    {
                        this.message = error.response.data.message;
                        this.alertSuccess = true;
                    }
                    else
                    {
                        this.message = 'Algo deu errado, tente novamente ou entre em contato com o suporte.';
                        this.alertSuccess = false;
                    }
				});
        }
    }
};
</script>
<style scoped>
    form div {height:80px}
    form div div{ width:48%; margin: 1%;float:left;height:80px}
    button{float:right;margin:10px 1%}
</style>