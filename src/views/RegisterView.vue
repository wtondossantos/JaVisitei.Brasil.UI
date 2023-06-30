<template>
    <div id="content">
        <h3>{{content}}</h3>
        <div v-if="message" class="alert alert-danger">
            {{ message }}
        </div>
        <Form @submit="handleRegister" :validation-schema="schema" autocomplete="off">
            <div>
                <div>
                    <label for="username" style="display:none">Username</label>
                    <Field name="username" type="text" placeholder="Username" maxlength="25"/>
                    <ErrorMessage name="username" class="error-feedback" />
                </div>
                <div class="group">
                    <div>
                        <label for="name" style="display:none">Nome</label>
                        <Field name="name" type="text" placeholder="Nome" maxlength="50" />
                        <ErrorMessage name="name" class="error-feedback"/>
                    </div>
                    <div>
                        <label for="surname" style="display:none">Sobrenome</label>
                        <Field name="surname" type="text" placeholder="Sobrenome" maxlength="150"/>
                        <ErrorMessage name="surname" class="error-feedback" />
                    </div>
                </div>
                <div class="group">
                    <div>
                        <label for="email" style="display:none">E-mail</label>
                        <Field name="email" type="email" placeholder="E-mail" maxlength="100"/>
                        <ErrorMessage name="email" class="error-feedback" />
                    </div>
                    <div>
                        <label for="reemail" style="display:none">Confirmar senha</label>
                        <Field name="reemail" type="email" placeholder="Confirmar e-mail" maxlength="100" />
                        <ErrorMessage name="reemail" class="error-feedback" />
                    </div>
                </div>
                <div class="group">
                    <div>
                        <label for="password" style="display:none">Senha</label>
                        <Field name="password" type="password" placeholder="Senha" maxlength="20"/>
                        <ErrorMessage name="password" class="error-feedback" />
                    </div>
                    <div>
                        <label for="repassword" style="display:none">Confirmar senha</label>
                        <Field name="repassword" type="password" placeholder="Confirmar senha" maxlength="20"/>
                        <ErrorMessage name="repassword" class="error-feedback" />
                    </div>
                </div>
                <div class="checkout">
                    <Field name="newsletter" type="checkbox" value="newsletter"/>
                    <label for="newsletter" style="display:block">Aceito receber novidades por e-mail</label>
                </div>
                <button>
                    <font-awesome-icon icon="sign-in-alt" /> Cadastre-se
                </button>
            </div>
            <Field name="key" id="key" value="6Lev8X8mAAAAAMdRbvdNiSB427Tz2CvmlyVMOMRD" type="hidden" aria-hidden="true"/>
        </Form>
        <p>Ao clicar no botão "Cadastre-se", você concoda com nossos 
            <router-link to="/termsOfUse">Termos de uso</router-link>, 
            <router-link to="/privacyPolicy">Política de privacidade</router-link> e
            <router-link to="/cookiesPolicy">Política de cookies</router-link>.
        </p>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
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
        reemail: yup
            .string()
            .required("Confirme o E-mail.")
            .email("E-mail inválido.")
            .max(100, "Máximo 100 caracteres."),
        password: yup
            .string()
            .required("Informe a senha.")
            .min(8, "Mínimo 8 caracteres.")
            .max(20, "Máximo 20 caracteres."),
        repassword: yup
            .string()
            .required("Confirme a senha.")
            .min(8, "Mínimo 8 caracteres.")
            .max(20, "Máximo 20 caracteres.")
    });
    
    return {
        content: 'Cadastre-se',
        message: '',
        schema
    };
  },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
    mounted() {
        if (this.loggedIn) {
            this.$router.push("/brasil");
        }
        else if (typeof grecaptcha === "undefined") {
            var script = document.createElement("script");
                script.src = `https://www.google.com/recaptcha/api.js?render=${key.value}`;
            document.head.appendChild(script);
        } 
    },
    methods: {
        handleRegister(user) {
            this.message = '';

            grecaptcha.ready(() => {
                grecaptcha.execute(key.value, {action: 'register'})
                    .then((token) => {
                        user.recaptcha = token;

                        if(user.password != user.repassword)
                        {
                            this.message = 'A confirmação da senha é diferente da senha.';
                            return;
                        }

                        this.$store.dispatch("auth/register", user).then(
                            () => {
                                this.$router.push("/activeAccount");
                            },
                            (error) => {
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
                                else if(error.response?.data?.message)
                                {
                                    this.message = error.response.data.message;
                                }
                                else
                                {
                                    this.message = 'Algo deu errado, tente novamente ou entre em contato com o suporte.';
                                }
                            }
                        );
                    });
            });
        }
    },
};
</script>

<style scoped>
    .alert{padding:10px 1%}
    form input, form textarea,form span { width:98%; margin: 10px 1%}
    form div div {height:80px}
    form div div div{ width:48%; margin: 1%;float:left;height:80px}
    button{float:right;margin:10px 1%}
    p{margin:10px 0 0;display: inline-block;}
    .checkout input{float: left;width: 16px;margin: 5px 1%;}
    .checkout label{float: left;}
</style>