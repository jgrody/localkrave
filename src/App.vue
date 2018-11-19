<template>
  <div id="app">
    <navbar></navbar>
    <router-view/>
  </div>
</template>

<script>
  import Navbar from './components/Navbar'

  export default {
    components: {
      Navbar
    }
  }
</script>

<style lang="scss">
  .navbar {
    -webkit-box-shadow: 0px 1px 1px 0px rgba(204,204,204,1);
    -moz-box-shadow: 0px 1px 1px 0px rgba(204,204,204,1);
    box-shadow: 0px 1px 1px 0px rgba(204,204,204,1);
  }

  .navbar-menu {
    background: #F5F5F5;
  }
</style>
