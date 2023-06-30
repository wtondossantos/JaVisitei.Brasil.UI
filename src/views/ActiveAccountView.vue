<template>
    <div id="content">
        <h3>{{content}}</h3>
        <div v-if="message" class="alert" :class="alertSuccess ? 'alert-success' : 'alert-danger'">
            {{ message }}
        </div>
        <Form @submit="handleGenerateCode" :validation-schema="schema" autocomplete="off" v-if="generateNewCode">
            <div>
                <div>
                    <label for="email" style="display:block" class="label-confirmacao">Informe o e-mail e solicite um novo código de confirmação:</label>
                    <Field name="email" type="email" placeholder="E-mail"/>
                    <ErrorMessage name="email" class="error-feedback" />
                </div>
                <button>
                    <font-awesome-icon icon="sign-in-alt" /> Gerar novo código
                </button>
            </div>
        </Form>
        <Form @submit="handleConfirm" :validation-schema="schema" autocomplete="off" v-else>
            <div>
                <div>
                    <label for="code" style="display:block" class="label-confirmacao">Informe o código de confirmação recebido por e-mail:</label>
                    <Field name="code" type="text" placeholder="Código de confirmação"/>
                    <ErrorMessage name="code" class="error-feedback" />
                </div>
                <button>
                    <font-awesome-icon icon="sign-in-alt" /> Confirmar conta
                </button>
            </div>
        </Form>
        <button @click="clickConfirm" v-if="generateNewCode">
             Confirmar conta
        </button>
        <button @click="clickRequestNewCode" v-else>
             Solicitar novo código
        </button>
    </div>
</template>

<script>
  import { reactive} from "vue";
  import { Form, Field, ErrorMessage } from "vee-validate";
  import * as yup from "yup";

  const data = reactive({code: 0, email: ''});


export default {
  name: "ActiveAccount",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
        code: yup
            .string()
            .max(10, "Código inválido.")
            .min(10, "Código inválido."),
        email: yup
            .string()
            .email("E-mail inválido.")
            .max(100, "Máximo 100 caracteres.")
    });

    return {
        content: 'Confirmar cadastro',
        message: '',
        generateNewCode: false,
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
        this.$router.push("/brasil");
    }
  },
  methods: {
    handleConfirm(data){
      this.message = "";

      this.$store.dispatch("auth/confirm", data).then(
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

            if(this.message.includes('expirado'))
            {
              this.generateNewCode = true;
              this.content = 'Solicitar novo código';
            }
        }
      );
    },
    handleGenerateCode(data){
      this.message = '';

      this.$store.dispatch("auth/generate", data).then(
        () => {
            this.message = 'Código de confirmação enviado para seu e-mail.';
            this.generateNewCode = false;
            this.alertSuccess = true;
            this.content = 'Confirmar cadastro';
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
    clickRequestNewCode(){
      this.generateNewCode = true;
      this.content = 'Solicitar novo código';
      this.message = '';
      this.alertSuccess = false;
    },
    clickConfirm(){
      this.content = 'Confirmar cadastro';
      this.generateNewCode = false;
      this.message = '';
      this.alertSuccess = false;
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
    .label-confirmacao{color:#000;font-size:1em;margin: 10px 1%}
</style>