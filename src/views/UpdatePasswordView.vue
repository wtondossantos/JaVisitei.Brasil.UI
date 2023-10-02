<template>
    <div id="content">
        <h3>{{content}}</h3>
        <div v-if="message" class="alert" :class="alertSuccess ? 'alert-success' : 'alert-danger'">
            {{ message }}
        </div>
        <Form @submit="handleForgot" :validation-schema="schema" autocomplete="off" v-if="forgotPassword">
            <div>
                <div>
                    <label for="email" style="display:block" class="label-confirmacao">Informe o e-mail e solicite a atualização da senha:</label>
                    <Field name="email" type="email" placeholder="E-mail"/>
                    <ErrorMessage name="email" class="error-feedback" />
                </div>
                <button>
                    <font-awesome-icon icon="sign-in-alt" /> Solicitar
                </button>
            </div>
        </Form>
        <Form @submit="handleReset" :validation-schema="schema" autocomplete="off" v-else>
            
            <div class="group">
                <div>
                    <label for="resetPasswordCode" style="display:none" class="label-confirmacao">Código de atualização:</label>
                    <Field name="resetPasswordCode" type="text" placeholder="Código de atualização"/>
                    <ErrorMessage name="resetPasswordCode" class="error-feedback" />
                </div>
                <div>
                    <label for="email" style="display:none">E-mail</label>
                    <Field name="email" type="email" placeholder="E-mail" maxlength="100"/>
                    <ErrorMessage name="email" class="error-feedback" />
                </div>
            </div>
            <div>
                <div class="group">
                    <div>
                        <label for="password" style="display:none">Nova senha</label>
                        <Field name="password" type="password" placeholder="Nova senha" maxlength="20"/>
                        <ErrorMessage name="password" class="error-feedback" />
                    </div>
                    <div>
                        <label for="rePassword" style="display:none">Confirmar nova senha</label>
                        <Field name="rePassword" type="password" placeholder="Confirmar nova senha" maxlength="20"/>
                        <ErrorMessage name="rePassword" class="error-feedback" />
                    </div>
                </div>
            </div>
            <button>
                <font-awesome-icon icon="sign-in-alt" /> Atualizar senha
            </button>
        </Form>
        <button @click="clickReset" v-if="forgotPassword">
             Atualizar senha
        </button>
        <button @click="clickForgot" v-else>
             Esqueci minha senha
        </button>
    </div>
</template>

<script>
  import { reactive} from "vue";
  import { Form, Field, ErrorMessage } from "vee-validate";
  import * as yup from "yup";

  const data = reactive({resetPasswordCode: 0, email: '', password: '', rePassword: ''});


export default {
  name: "ManagerPassword",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
        resetPasswordCode: yup
            .string()
            .max(10, "Código inválido.")
            .min(10, "Código inválido."),
        email: yup
            .string()
            .email("E-mail inválido.")
            .max(100, "Máximo 100 caracteres."),
        password: yup
            .string()
            .min(8, "Mínimo 8 caracteres.")
            .max(20, "Máximo 20 caracteres."),
        rePassword: yup
            .string()
            .min(8, "Mínimo 8 caracteres.")
            .max(20, "Máximo 20 caracteres.")
    });

    return {
        content: 'Atualizar senha',
        message: '',
        forgotPassword: false,
        alertSuccess: false,
        schema,
        data
    };
  },
  computed: {
    loggedIn() {
        return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
        this.$router.push("/profile");
    }
  },
  methods: {
    handleReset(data){
      this.message = '';

      if(data.password != data.rePassword)
      {
        this.alertSuccess = false;
        this.message = 'A confirmação de senha é diferente da senha.';
        return;
      }

      this.$store.dispatch("auth/reset", data).then(
        () => {
            this.$router.push("/login");
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
                this.alertSuccess = false;
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
        }
      );
    },
    handleForgot(data){
      this.message = '';

      this.$store.dispatch("auth/forgot", data).then(
        () => {
            this.message = 'Código de atualização enviado para seu e-mail.';
            this.forgotPassword = false;
            this.alertSuccess = true;
            this.content = 'Atualizar senha';
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
                this.alertSuccess = false;
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
        }
      );
    },
    clickForgot(){
      this.forgotPassword = true;
      this.content = 'Esqueci minha senha';
      this.message = '';
      this.alertSuccess = false;
    },
    clickReset(){
      this.content = 'Atualizar senha';
      this.forgotPassword = false;
      this.message = '';
      this.alertSuccess = false;
    }
  },
};
</script>

<style scoped>
    .alert{padding:10px 1%}
    form div div {height:80px}
    form div div div{ width:48%; margin: 1%;float:left;height:80px}
    button{float:right;margin:10px 1%}
    .label-confirmacao{color:#000;font-size:1em;margin: 10px 1%}
</style>