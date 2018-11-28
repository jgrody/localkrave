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
                @click="addModalOpen = true"
              >
                <span>Add Product</span>
              </a>
            </div>
          </nav>

          <div class="content">
            <table class="table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products">
                  <td>
                    <img
                      v-bind:src="product.imageUrl"
                      width="50"
                    >
                  </td>
                  <td>{{product.name}}</td>
                  <td>{{product.slug}}</td>
                  <td>{{product.price}}</td>
                  <td>{{product.description}}</td>
                  <td>
                    <a class="button is-primary" style="margin-right: 10px;">Edit</a>
                    <a
                      class="button is-danger"
                      v-on:click="remove(product)"
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
      :isOpen="addModalOpen"
      :product="newProduct"
      v-on:update:addModalOpen="closeModal"
    ></admin-products-add-modal>
  </div>
</template>

<script>
  import {storage, PRODUCTS_COLLECTION} from '../../../firebase'
  import AdminMenu from '../Aside'
  import AdminProductsAddModal from './Add'

  export default {
    name: 'Admin',
    components: {
      AdminMenu,
      AdminProductsAddModal
    },
    data: () => {
      return {
        products: [],
        newProduct: {
          productPhoto: {},
          name: '',
        },
        addModalOpen: false,
      }
    },
    created: function (){
      this.fetchProducts()
    },
    methods: {
      fetchProducts: function (){
        PRODUCTS_COLLECTION
          .onSnapshot(querySnapshot => {
            this.products = []
            querySnapshot.forEach(
              doc => this.products.push(doc.data())
            )
          })
      },
      remove: function (product){
        return PRODUCTS_COLLECTION
          .doc(product.slug)
          .delete()
          .then(() => this.removeImage(product))
      },
      removeImage: function (product){
        return storage.child(`product_images/${product.slug}.jpg`).delete()
      },
      resetNewProduct: function (){
        this.newProduct.name = ''
        this.newProduct.slug = ''
        this.newProduct.price = ''
        this.newProduct.description = ''
      },
      cancelAdd: function (){
        this.addModalOpen = false;
        this.resetNewProduct()
      },
      closeModal: function (){
        this.addModalOpen = false
      },
    }
  }
</script>