<template>
		  <header id="header">
      <h1 id="logo">
        <router-link to="/home" title="Já Visitei">
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
        </router-link>
      </h1>
			<nav class="menu">
        <button class="menu-mobile" id="menuMobile" @click="onClickMenuMobile">
          <font-awesome-icon icon="bars" />
        </button>
				<ul ref="menu" id="menu" @click="onClickMenuMobile">
					<li id="menuHome">
            <router-link to="/home">
              <font-awesome-icon icon="home" /> Home
            </router-link>
					</li>
					<li id="menuSobre">
            <router-link to="/history">
              Sobre
            </router-link>
					</li>
					<li id="menuContato">
            <router-link to="/contact">
              Contato
            </router-link>
					</li>
					<li id="menuBrasil" v-if="currentUser">
            <router-link :to="{name:'brasil'}">
              <font-awesome-icon icon="map-location-dot" /> Brasil
            </router-link>
					</li>
					<li id="menuEarth" v-if="currentUser">
            <router-link :to="{name:'earth'}">
              <font-awesome-icon icon="map-location-dot" /> Mundi
            </router-link>
					</li>
          <li v-if="!currentUser">
            <router-link to="/register">
              <font-awesome-icon icon="user-plus" /> Criar conta
            </router-link>
          </li>
          <li v-if="!currentUser">
            <router-link to="/login">
              <font-awesome-icon icon="sign-in-alt" /> Login
            </router-link>
          </li>
          <li v-if="currentUser">
            <router-link to="/profile">
              <font-awesome-icon icon="user" />
              {{ currentUser.username }}
            </router-link>
          </li>
          <li v-if="currentUser">
            <a @click.prevent="logOut">
              <font-awesome-icon icon="sign-out-alt" /> LogOut
            </a>
          </li>
					<!-- <li id="menuMundo" v-if="currentUser">
						<a href="e" title="">Mundo</a>
					</li> -->
					<!-- <li id="menuComprar">
						<a href="v" title="">Comprar</a>
					</li> -->
        </ul>
      </nav>
      <div class="search">
        <input v-if="currentUser && (currentMapBrazil || currentMapEarth)" type="search" id="search" autocomplete="off" placeholder="Buscar região" title="Buscar name por nome">
      </div>
		</header>
    <div class="container">
      <router-view />
    </div>
</template>

<script>
  import { ref } from "vue";

	const menu = ref(null);

  export default {
		setup(){
			return {
				menu
      }
    },
    computed: {
      currentUser() {
        return this.$store.state.auth.user;
      },
      currentMapBrazil(){
        return this.$router.currentRoute.value.name === 'brasil';
      },
      currentMapEarth(){
        return this.$router.currentRoute.value.name === 'earth';
      }
      // ,showAdminBoard() {
      //   if (this.currentUser && this.currentUser['roles']) {
      //     return this.currentUser['roles'].includes('ROLE_ADMIN');
      //   }

      //   return false;
      // },
      // showModeratorBoard() {
      //   if (this.currentUser && this.currentUser['roles']) {
      //     return this.currentUser['roles'].includes('ROLE_MODERATOR');
      //   }

      //   return false;
      // }
    },
    methods: {
      logOut() {
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');
      },
			onClickMenuMobile(){
        if(innerWidth < 531)
        {
          this.menuActive = !this.menuActive;
          if(this.menuActive)
            menu.value.style = 'display:block!important';
          else
            menu.value.style = 'display:none!important';
        }
			}
    },
		data(){
			return{
				menuActive: false
			}
		}
  };
</script>

<style scoped>
  .container{
    margin-top:50px
  }
  #menuMobile{display:none}
</style>