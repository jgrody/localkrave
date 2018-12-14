<template>
  <div class="home">
    <section class="section">
      <div class="container is-fullhd master-container">
        <aside class="menu">
          <p class="menu-label">
            Brands
          </p>
          <ul class="menu-list">
            <li v-for="brand in brands">
              <a @click="filterByBrand(brand)">
                {{brand}}
              </a>
            </li>
          </ul>
        </aside>
        
        <div class="products-container">
          <div
            class="product"
            v-for="product in sortedByBrand"
            v-bind:key="product.slug"
          >
            <div
              class="product-thumb"
              v-bind:style="{backgroundImage: 'url(' + (product.imageUrl || `https://via.placeholder.com/250`) + ')'}"
            >
            </div>
            <div class="product-details">
              <div>
                <div style="margin-bottom: 5px;">
                  <b>{{product.name}}</b>
                  <div
                    style="margin-right: 5px; font-size: 14px;"
                  >
                    by {{product.brand}}
                  </div>
                  <b
                    style="color: darkgoldenrod"
                    v-if="product.price"
                  >
                    ${{product.price}}
                  </b>
                </div>
                <div style="margin-bottom: 15px; color: darkslategray; font-size: 14px;">
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
    </section>
  </div>
</template>

<script>
import { PRODUCTS_COLLECTION } from "../firebase";

export default {
  name: "Home",
  data: () => {
    return {
      products: []
    };
  },
  created: function() {
    window.t = this;
    this.loadData();
  },
  methods: {
    loadData: function() {
      return PRODUCTS_COLLECTION.onSnapshot(querySnapshot => {
        this.products = [];
        querySnapshot.forEach(doc => this.products.push(doc.data()));
      });
    },
  },
  computed: {
    sortedByBrand: function (){
      return this.products
      .filter(product => product.displaying)
      .sort((a, b) => a.brand > b.brand)
    },
    brands: function (){
      const brands = this.products.map(p => p.brand)
      return Array.from(new Set(brands))
    },
  },
};
</script>

<style lang="scss">
.home {
  height: 100vh;
}

.master-container {
  display: flex;
}

.menu {
  flex: 1;
}

.products-container {
  flex: 4;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: wrap;
  padding: 20px;
}

.product {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 4px;
  margin: 0 10px 20px 10px;
  box-sizing: border-box;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  flex: 1 225px;

  &:hover {
    top: -2px;
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.2);
  }

  .product-thumb {
    background-size: cover;
    background-position: center center;
    padding-bottom: 60%;
  }

  .product-details {
    padding: 10px;
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

.menu-list {
  li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// @media screen and (min-width: 960px) {
//   .product {
//     flex: 1 300px;
//   }
// }

// @media screen and (max-width: 769px) {
//   .product {
//     flex: 1 45%;
//   }
//   .greeting-hero-img-container {
//     display: none;
//   }
// }

// @media screen and (max-width: 500px) {
//   .product {
//     flex: 1 100%;
//   }
// }
</style>
