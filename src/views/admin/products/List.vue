<template>
  <div class="admin-products">
    <section class="section">
      <div class="columns">
        <div class="column is-one-quarter">
          <admin-menu></admin-menu>
        </div>
        <div class="column">
          <nav class="level is-mobile">
            <div class="level-left">
              <div class="level-item has-text-centered">
                <div>
                  <p class="title">Products</p>
                </div>
              </div>
            </div>
            <div class="level-right">
              <a
                class="button is-success"
                @click="openAddModal()"
                style="margin-right: 10px;"
              >
                <span>Add Product</span>
              </a>
              <a
                class="button is-warning"
                @click="importData()"
              >
                <span>Import</span>
              </a>
            </div>
          </nav>

          <div class="content">
            <table class="table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>Image</th>
                  <th style="width: 20%;">Brand</th>
                  <th style="width: 20%;">Name</th>
                  <th>Price</th>
                  <th style="width: 20%;">Description</th>
                  <th>Displaying?</th>
                  <th>In Stock?</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in sortedByBrand" v-bind:key="product.slug">
                  <td>
                    <img
                      v-if="product.imageUrl"
                      v-bind:src="product.imageUrl"
                      width="50"
                    >
                    <img
                      v-if="!product.imageUrl"
                      src="https://via.placeholder.com/50"
                    >
                  </td>
                  <td>{{product.brand}}</td>
                  <td>{{product.name}}</td>
                  <td>{{product.price}}</td>
                  <td>{{product.description}}</td>
                  <td>
                    {{product.displaying ? 'Yes' : 'No'}}
                  </td>
                  <td>
                    {{product.available ? 'Yes' : 'No'}}
                  </td>
                  <td>
                    <a
                      class="button is-primary"
                      style="margin-right: 10px;"
                      @click="openEditModal(product)"
                    >
                      Edit
                    </a>
                    <a
                      class="button is-danger"
                      @click="remove(product)"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
    <admin-products-add-modal
      v-if="addModalOpen"
      :isOpen="addModalOpen"
      :product="newProduct"
      v-on:update:addModalOpen="closeModal"
    ></admin-products-add-modal>
  </div>
</template>

<script>
import { storage, PRODUCTS_COLLECTION } from "../../../configs";
import AdminMenu from "../Aside";
import AdminProductsAddModal from "./Add";
import { slugify } from "../../../helpers/slugify";

export default {
  name: "Admin",
  components: {
    AdminMenu,
    AdminProductsAddModal
  },
  data: () => {
    return {
      products: [],
      newProduct: {
        productPhoto: {},
        name: ""
      },
      addModalOpen: false
    };
  },
  created: function() {
    this.fetchProducts();
  },
  computed: {
    sortedByBrand: function() {
      return this.products.sort((a, b) => {
        return a.brand > b.brand;
      });
    }
  },
  methods: {
    fetchProducts: function() {
      PRODUCTS_COLLECTION.onSnapshot(querySnapshot => {
        this.products = [];
        querySnapshot.forEach(doc => this.products.push(doc.data()));
      });
    },
    remove: function(product) {
      return PRODUCTS_COLLECTION.doc(product.slug)
        .delete()
        .then(() => this.removeImage(product));
    },
    removeImage: function(product) {
      if (product.productImage) {
        return storage.child(`product_images/${product.slug}.jpg`).delete();
      }
    },
    resetNewProduct: function() {
      this.newProduct.brand = "";
      this.newProduct.name = "";
      this.newProduct.blend = "";
      this.newProduct.description = "";
      this.newProduct.price = "";
      this.newProduct.size = "12oz";
      this.newProduct.displaying = false;
      this.newProduct.available = true;
      this.newProduct.slug = "";
    },
    importData: function() {
      Sheetsu.read(
        "https://sheetsu.com/apis/v1.0su/f8724fe0fdbc.json",
        {},
        data => {
          data.forEach(product => {
            const { brand, name } = product;

            const slug = (product.slug = slugify(name));

            product.size = "12oz";
            product.displaying = true;
            product.available = true;
            product.brandSlug = slugify(brand);

            PRODUCTS_COLLECTION.doc(slug).set(product);
          });
        }
      );
    },
    openAddModal: function() {
      this.resetNewProduct();
      this.addModalOpen = true;
    },
    openEditModal: function(product) {
      this.newProduct = { ...product };
      this.newProduct.productPhoto = this.newProduct.productPhoto || {};
      this.addModalOpen = true;
    },
    cancelAdd: function() {
      this.addModalOpen = false;
      this.resetNewProduct();
    },
    closeModal: function() {
      this.addModalOpen = false;
    }
  }
};
</script>
