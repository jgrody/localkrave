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
              <div
                class="product-thumb"
                v-bind:style="{backgroundImage: 'url(' + product.imageUrl + ')'}"
              >
              </div>
              <div class="product-details">
                <div>
                  <div style="margin-bottom: 10px;">
                    <b style="margin-right: 5px;">{{product.name}}</b>
                    <b style="color: darkgoldenrod">${{product.price}}</b>
                  </div>
                  <div style="margin-bottom: 25px; color: darkslategray;">
                    {{product.description}}
                  </div>
                </div>
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
  import {PRODUCTS_COLLECTION} from '../firebase'

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
        return PRODUCTS_COLLECTION
          .onSnapshot(querySnapshot => {
            this.products = []
            querySnapshot.forEach(
              doc => this.products.push(doc.data())
            )
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
    align-items: stretch;
    flex-wrap: wrap;
  }

  .product {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 4px;
    margin: 0 5px 20px 5px;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    flex: 1 25%;
    position: relative;

    &:hover {
      top: -2px;
      box-shadow: 0 4px 5px rgba(0,0,0,0.2);
    }

    .product-thumb {
      background-size: cover;
      background-position: center center;
      padding-bottom: 60%;
    }

    .product-details {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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

  @media screen and (min-width: 960px) {
    .product {
      flex: 1 23%;
    }
  }

  @media screen and (max-width: 769px) {
    .product {
      flex: 1 45%;
    }
    .greeting-hero-img-container {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    .product {
      flex: 1 100%;
    }
  }


</style>