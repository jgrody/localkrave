<template>
  <div class="home">
    <section class="hero is-dark is-bold">
      <div class="hero-body greeting-hero">
        <div class="container">
          <div class="columns">
            <div class="column is-two-thirds">
              <h1 class="title">
                Our Shop
              </h1>
              <div class="subtitle">
                <p class="subtitle-note">
                  Local Krave is famous for the best buttered coffee, pour overs,
                  breakfast sandwiches, and Belgian liege waffles in San Diego!
                </p>
                <p class="subtitle-note">
                  There is no better way to start your morning, than with Local Krave.
                  Our famous Kraveman buttered coffee, complemented with a breakfast
                  sandwich is the fuel for a positive day ahead of you!
                </p>
                <p class="subtitle-note">
                  All of our items on our menu are crafted with natural ingredients and love.
                  Come visit us today!
                </p>
              </div>
            </div>
            <div class="column is-one-third greeting-hero-img-container">
              <figure class="image">
                <img src="waffles.jpg" alt="Image" width="300" height="300">
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="hero is-light is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Local Krave Market
          </h1>
          <div class="products-container">
            <div class="product" v-for="product in products">
              <div>
                <figure class="image">
                  <img
                    v-bind:src="`https:${product.image.fields.file.url}?w=210`"
                    v-bind:alt="product.name"
                    width="210"
                  >
                </figure>
              </div>
              <div class="product-details">
                <a class="button is-success">
                  <span class="icon is-small">
                    <i class="fas fa-check"></i>
                  </span>
                  <span>Add to Cart</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data: () => {
      return {
        products: []
      }
    },
    created: function() {
      window.t = this;
      this.loadData()
    },
    methods: {
      loadData: function(){
        return Promise.all([window.client.getEntries('products')])
        .then(data => {
          this.products = data[0].items.map(item => item.fields)
        })

      }
    }
  }
</script>

<style lang="scss">
  .home {
    height: 100vh;
  }
  .products-container {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .product {
    display: flex;
    align-items: center;
    flex-direction: column;
    background: white;
    border: 3px solid gainsboro;
    border-radius: 4px;
    padding: 5px;
    min-width: 200px;
    margin-bottom: 20px;

    &:not(:first-child):not(:last-child) {
      margin: 0 5px;
    }

    img {
      max-height: 138px;
    }

    .product-details {
      padding: 10px 5px;
      width: 100%;
    }
  }

  .subtitle-note:not(:last-child) {
    margin-bottom: 1em;
  }

  .greeting-hero {
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .greeting-hero-details-container {
    margin-right: 5%;
  }

  .greeting-hero-img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 250px;

    img {
      min-width: 250px;
      border-radius: 4px;
      box-shadow: 0px 2px 2px 0px black;
    }
  }

  @media screen and (max-width: 769px) {
    .greeting-hero-img-container {
      display: none;
    }
  }

</style>