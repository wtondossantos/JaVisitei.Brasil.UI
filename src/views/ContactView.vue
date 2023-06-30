<template>
    <div id="content">
        <h3>{{content}}</h3>
        <div v-if="message" class="alert" :class="alertSuccess ? 'alert-success' : 'alert-danger'">
            {{ message }}
        </div>
        <Form @submit="handleContact" :validation-schema="schema" autocomplete="off">
            <Field name="id" value="3" type="hidden" aria-hidden="true"/>
            <Field name="key" id="key" value="6Lev8X8mAAAAAMdRbvdNiSB427Tz2CvmlyVMOMRD" type="hidden" aria-hidden="true"/>
            <div>
                <label for="subject" style="display:none">Assunto</label>
                <Field name="subject" type="text" placeholder="Assunto" id="subject"/>
                <ErrorMessage name="subject" class="error-feedback" />
            </div>
            <div>
                <label for="email" style="display:none">Email</label>
                <Field name="email" type="email" placeholder="E-mail" id="email"/>
                <ErrorMessage name="email" class="error-feedback" />
            </div>
            <div>
                <label for="message" aria-hidden="true" style="display:none">Mensagem</label>
                <Field as="textarea" name="message" id="message" cols="30" rows="10" placeholder="Descreva a mensagem" maxlength="1000"/>
                <ErrorMessage name="message" class="error-feedback" />
            </div>
            <button>
                <font-awesome-icon icon="sign-in-alt" /> Enviar
            </button>
        </Form>
    </div>
</template>
<script>
    import { Form, Field, ErrorMessage } from "vee-validate";
    import * as yup from "yup";
	import http from '@/services/http.js';

    export default {
        name: "Contact",
        components: {
            Form,
            Field,
            ErrorMessage,
        },
        data() {
            const schema = yup.object().shape({
                email: yup.string().required("O e-mail é obrigatório!")
                    .min(3, "Mínimo 3 caracteres.")
                    .max(120, "Máximo 120 caracteres."),
                subject: yup.string().required("Informe um assunto!")
                    .min(3, "Mínimo 3 caracteres.")
                    .max(100, "Máximo 100 caracteres."),
                message: yup.string().required("Escreva sua mensagem!")
                    .min(10, "Mínimo 10 caracteres.")
                    .max(1000, "Máximo 1000 caracteres.")
            });
            
            return {
                message: '',
                schema,
                content: "Contato",
                alertSuccess: false,
            };
        },
        mounted() {
            if (typeof grecaptcha === "undefined") {
                var script = document.createElement("script");
                script.src = `https://www.google.com/recaptcha/api.js?render=${key.value}`;
                document.head.appendChild(script);
            } 
        },
        methods: {
            handleContact(data) {
                grecaptcha.ready(() => {
                    grecaptcha.execute(key.value, {action: 'contact'})
                        .then((token) => {
                            data.recaptcha = token;
                        
                            http.post('contact', data)
                                .then((response) => {
                                    if(response.data.data.sent)
                                    {
                                        this.message = 'Mensagem enviada com sucesso!';
                                        this.alertSuccess = true;
                                        subject.value = '';
                                        email.value = '';
                                        message.value = '';
                                    }
                                    else{
                                        this.message = 'Algo deu errado, tente novamente ou entre em contato com o suporte.';
                                        this.alertSuccess = false;
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
                                        this.alertSuccess = false;
                                    }
                                    else
                                    {
                                        this.message = 'Algo deu errado, tente novamente ou entre em contato com o suporte.';
                                        this.alertSuccess = false;
                                    }
                                });
                    });
                });
            }
        }
    };
</script>
<style scoped>
    form input, form textarea { width:98%; margin: 10px 1%}
    button{float:right;margin:10px 1%}
</style>