<template>
    <div id="content">
        <h3>{{ content }}</h3>
        <h4>O que são cookies e o que esta política aborda?</h4>
        <p>Cookies são pequenos trechos de texto usados para armazenar informações em navegadores da web. Eles são usados para armazenar e receber identificadores e outras informações em dispositivos como computadores e smartphones. Essas tecnologias, incluindo os dados armazenados no navegador ou dispositivo, são conhecidas como cookies.</p>
        <p>Os cookies nos ajudam a fornecer, proteger e aprimorar o produto Já Visitei, melhorando a visualização e viabilizando uma experiência mais segura. Os cookies que usamos incluem cookies de sessões para autenticação e autorização, que são removidos ao sair("logout") do site, e cookies persistentes, que ficam no navegador até eles expirarem ou você os excluir. Embora os cookies usados possam variar à medida que melhoramos e atualizamos o site, eles são usados para Autenticação, Autorização, Segurança e Desempenho.</p>
        <h5>Quais dados são utilizados nos cookies:</h5>
        <p>Pessoais: Nome e Sobrenome, E-mail e username informado. Esses dados são armazenados nos cookies ao Entrar e/ou cadastra-se no site e ao efetuar o logout(sair) esses cookies são removidos.</p>
        <p>Não pessoais, como endereço IP, tipo de navegador, dispositivo utilizado, páginas visitadas e dados de uso do site.</p>
    </div>
</template>

<script>

export default {
  name: "Cookies",
  data() {
    return {
      content: "Política de Cookies",
    };
  },
  mounted() {
  }
};
</script>