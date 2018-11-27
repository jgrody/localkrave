<template>
  <nav class="navbar is-light">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://localkrave.com">
        <img v-bind:src="`localkravebrand.png`" alt="Local Krave">
      </a>
      <div
        class="navbar-burger burger"
        data-target="navbarExampleTransparentExample"
        v-on:click="doit"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div
      id="navbarExampleTransparentExample"
      class="navbar-menu"
      v-bind:class="[isActive ? activeClass : '']"
    >
      <div class="navbar-end">
        <router-link
          class="navbar-item"
          to="/"
        >
          Home
        </router-link>
        <router-link
          class="navbar-item"
          to="/menu"
        >
          Menu
        </router-link>
        <router-link
          class="navbar-item"
          to="/market"
        >
          Market
        </router-link>
        <router-link
          class="navbar-item"
          to="/about"
        >
          About
        </router-link>

        <router-link
          class="navbar-item"
          to="/admin"
        >
          Admin
        </router-link>

        <div class="navbar-item">
          <a class="button">
            <span class="icon">
              <i class="fas fa-shopping-cart" aria-hidden="true"></i>
            </span>
            <span>Cart</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: "Navbar",
    data: function (){
      return {
        isActive: false,
        activeClass: 'is-active',
        doit: () => {
          this.isActive = !this.isActive
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
