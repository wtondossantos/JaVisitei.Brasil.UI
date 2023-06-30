<template>
  <div id="content">
	  <section>  
      <div class="logo">
        <svg version="1.1" id="geral" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 619.2 619.1" style="enable-background:new 0 0 619.2 619.1;" xml:space="preserve">
          <path style="fill:#6633CC;" d="M309.6,490.6c-64.3,0-117.2-37.1-181.1-78.5C108.9,399.5,0.1,330.8,0.1,309.6c0-21.9,109.1-92.1,128.4-104.3
            c66.6-42.1,116.8-76.9,181.1-76.8c100,0.1,181.1,81.1,181.1,181.1S409.6,490.6,309.6,490.6z"/>
          <path style="fill:#9966FF;" d="M309.6,470.2c-57,0-104-32.9-160.6-69.6c-17.4-11.3-113.9-72.2-113.9-91h435.1
            C470.3,398.3,398.4,470.2,309.6,470.2z"/>
          <path style="fill:#FF6600;" d="M128.5,309.6c0-64.3,37.1-117.2,78.5-181.1C219.7,108.9,288.4,0.1,309.6,0.1c21.9,0,92.1,109.1,104.3,128.4
            c42.1,66.6,76.9,116.8,76.8,181.1c-0.1,100-81.1,181.1-181.1,181.1S128.5,409.6,128.5,309.6z"/>
          <path style="fill:#FF9900;" d="M148.9,309.6c0-57,141.8-274.5,160.6-274.5v435.1C220.9,470.3,148.9,398.4,148.9,309.6z"/>
          <path style="fill:#339900;" d="M309.6,128.5c64.3,0,117.2,37.1,181.1,78.5C510.2,219.7,619,288.4,619,309.6c0,21.9-109.1,92.1-128.4,104.3
            C424,456,373.8,490.8,309.5,490.7c-100-0.1-181.1-81.1-181.1-181.1S209.6,128.5,309.6,128.5z"/>
          <path style="fill:#66CC00;" d="M309.5,148.9c57,0,104,32.9,160.6,69.6c17.4,11.3,113.9,72.2,113.9,91H148.9
            C148.9,220.9,220.8,148.9,309.5,148.9z"/>
          <path style="fill:#0033CC;" d="M490.6,309.6c0,64.3-37.1,117.2-78.5,181.1c-12.7,19.6-81.4,128.4-102.6,128.4
            c-21.9,0-92.1-109.1-104.3-128.4c-42.1-66.6-76.9-116.8-76.8-181.1c0.1-100,81.1-181.1,181.1-181.1S490.6,209.6,490.6,309.6z"/>
          <path style="fill:#0099FF;" d="M470.2,309.6c0,57-32.9,104-69.6,160.6c-11.3,17.4-72.2,113.9-91,113.9V148.9
            C398.3,148.9,470.2,220.9,470.2,309.6z"/>
          <circle style="fill:#FFFFFF;" cx="309.6" cy="309.6" r="160.6"/>
          <polygon style="fill:#FF3300;" points="288.7,289.7 389.9,229.3 330.7,330.6 229.3,389.9 		"/>
          <polygon style="fill:#CC0000;" points="389.9,229.3 330.7,330.6 229.3,389.9 		"/>
        </svg> 
      </div>
      <h3 class="javisitei">Já Visitei</h3>
      <p>Versão digital do Mapa Já Visitei com todos os 5570 municípios do Brasil.</p>
      <img src="/src/assets/mapa.jpg"/>
	  </section>
	  <section class="block-right" v-if="!currentUser">
      <h3>Bem vindo!</h3>
      <p>Efetue o login para gerenciar seu mapa!</p>
      <router-link class="button" to="/login">
        <font-awesome-icon icon="sign-in-alt" /> Login
      </router-link>
      <p>Crie sua conta e personalize o seu mapa!</p>
      <router-link class="button" to="/register">
        <font-awesome-icon icon="user-plus" /> Criar conta
      </router-link>
	  </section>
  </div>
</template>

<script>

  export default {
    name: "Home",
    data() {
      return {
        content: "Home",
      };
    },
    mounted() {
      // UserService.getPublicContent().then(
      //   (response) => {
      //     this.content = response.data;
      //   },
      //   (error) => {
      //     this.content =
      //       (error.response &&
      //         error.response.data &&
      //         error.response.data.message) ||
      //       error.message ||
      //       error.toString();
      //   }
      // );
    },
    computed: {
      currentUser() {
        return this.$store.state.auth.user;
      }
    }
  };
</script>

<style scoped>
    .logo{width: 34px;
    position: absolute;
    left: 9%;
    top: 7.5%;}
    section{
      float:left;
      width:46%;
      border: #c3bfbf solid 1px;
      margin: 0 2%;
      padding:4%;
    }
    .button{
      border: 1px solid #888;
      padding: 0.6em 2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: border-color 0.25s;
      background:#f0f0f0;
      margin-bottom:50px;
    }
    .button:hover {
      border-color: #646cff;
    }
    #content {
      width: 80%;
    }
    a,p{display: inline-block;}
    p{width:100%;}
    .block-right{text-align:center;}
    .javisitei{margin: 0 0 0 45px;}
    section img{width: 100%;margin-top:20px}

</style>