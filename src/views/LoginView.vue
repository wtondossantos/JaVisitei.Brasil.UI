<template>
	<section id="login">
      <div v-if="message" class="alert alert-danger" role="alert">
        {{ message }}
      </div>
    <Form @submit="handleLogin" :validation-schema="schema" autocomplete="off">
        <h3>Login</h3>
        <label for="email" style="display:none">Email</label>
        <Field name="email" v-model="user.email" type="email" placeholder="E-mail" class="form-control" />
        <ErrorMessage name="email" class="error-feedback" />
        <label for="password" aria-hidden="true" style="display:none">Password</label>
        <Field name="password" v-model="user.password" type="password" placeholder="Senha" class="form-control" />
        <ErrorMessage name="password" class="error-feedback" />
        <button :disabled="loading">
          <font-awesome-icon icon="sign-in-alt" /> Login
        </button>
    </Form>
    <router-link to="/managerPassword" class="forgot left">
      <font-awesome-icon icon="key" /> Esqueci a senha
    </router-link>
    <router-link to="/register" class="forgot right">
      <font-awesome-icon icon="user-plus" /> Criar conta
    </router-link>
  </section>
</template>

<script>
  import {reactive} from 'vue';
  import { Form, Field, ErrorMessage } from "vee-validate";
  import * as yup from "yup";

  const user = reactive({email:'', password:''});

  export default {
    name: "Login",
    components: {
      Form,
      Field,
      ErrorMessage,
    },
    data() {
      const schema = yup.object().shape({
        email: yup.string().required("O e-mail é obrigatório!"),
        password: yup.string().required("A senha é obrigatória!"),
      });

      return {
        loading: false,
        message: '',
        schema,
        user
      };
    },
    computed: {
      loggedIn() {
        return this.$store.state.auth.status.loggedIn;
      },
    },
    created() {
      if (this.loggedIn) {
        this.$router.push("/brasil");
      }
    },
    methods: {
      handleLogin(user) {
        this.loading = true;

        this.$store.dispatch("auth/login", user).then(
          () => {
            this.$router.push("/brasil");
          },
          (error) => {
            if(error.response &&
              error.response.data &&
              error.response.data.errors && 
              error.response.data.errors.$values.length > 0)
            {
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
            }
            else
            {
              this.message = 'Algo deu errado, tente novamente ou entre em contato com o suporte.';
            }
            this.loading = false;
          }
        );
      },
    },
  };

</script>
<style scoped>
  #login{
    position: relative;
    width: 400px;
    margin: 0 auto;
    border: 1px solid #25a;
    padding: 25px 40px 60px;
  }
  #login input{
    margin: 15px 0 0 0;
    width: 100%;
    height: 40px;
    line-height: 40px;background: #f7f7f7;
    border: 1px solid #333;
  }
  #login button{
    width: 100%;
    border-radius: 0;
    background:#8dd521;
    border:1px solid #666;
    margin: 15px 0 0 0;
  }
  .error-feedback{color:#f00;margin:-5px 0 0 0}

  .forgot{font-size: 0.9em;
    text-decoration: underline;
    margin: 15px 0 0;
    display: block;}
</style>