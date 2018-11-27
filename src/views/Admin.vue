<template>
  <div class="admin">
    <section class="section">
      <div class="container">
        <h1 class="title">Products</h1>
        <h2 class="subtitle">
          Here's the list of products available on the marketplace.
          You can add, edit and remove any items you want.
        </h2>
        <a
          class="button is-success"
          @click="addModalOpen = true"
        >
          <span>Add Product</span>
        </a>

        <table class="table is-fullwidth">
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
                  width="100"
                  height="100"
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
    </section>

    <div
      class="modal"
      v-bind:class="{'is-active': addModalOpen}"
    >
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add New Product</p>
          <button
            class="delete"
            aria-label="close"
            @click="addModalOpen = false"
          ></button>
        </header>
        <section class="modal-card-body">
          <form action="">
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input class="input" type="text" placeholder="Ground Coffee, etc." v-model="newProduct.name">
              </div>
            </div>
            <div class="field">
              <label class="label">Slug</label>
              <div class="control">
                <input class="input" type="text" placeholder="e.g., ground-coffee. all lowercase and separated by dashes" v-model="newProduct.slug">
              </div>
            </div>

            <div class="field">
              <label class="label">Price</label>
              <div class="control">
                <input class="input" type="number" placeholder="8.99" v-model="newProduct.price">
              </div>
            </div>

            <div class="field">
              <label class="label">Description</label>
              <div class="control">
                <textarea class="textarea" placeholder="Describe the item for the user" v-model="newProduct.description"></textarea>
              </div>
            </div>

            <div class="file has-name">
              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  name="productPhoto"
                  ref="productPhoto"
                  @change="setPhoto"
                >
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a file…
                  </span>
                </span>
                <span class="file-name">
                  {{newProduct.productPhoto.name}}
                </span>
              </label>
          </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            @click="save"
          >
            Save changes
          </button>
          <button class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
const db = firebase.firestore()
const storage = firebase.storage().ref()

export default {
  name: 'Admin',
  data: () => {
    return {
      products: [],
      newProduct: {
        productPhoto: {}
      },
      addModalOpen: false,
    }
  },
  created: function (){
    window.t = this;
    this.fetchProducts()
  },
  methods: {
    fetchProducts: function (){
      db.collection("products")
        .onSnapshot(querySnapshot => {
          this.products = []
          querySnapshot.forEach(
            doc => this.products.push(doc.data())
          )
        })
    },
    hideModal: function (){
      this.addModalOpen = false
    },
    resetNewProduct: function (){
      this.newProduct = {}
    },
    save: function (){
      const {name, slug, price, description} = this.newProduct

      db.collection('products').doc(this.newProduct.slug).set({
        name,
        slug,
        price,
        description
      })
      .then(() => this.storeImage(this.newProduct))
      .then(() => this.hideModal() )
      .then(() => this.resetNewProduct() )
      .catch(response => {
        console.log('response', response);
      })
    },
    storeImage: function (product){
      return storage
        .child(`product_images/${product.slug}.jpg`)
        .put(product.productPhoto)
        .then(() => this.getImage(product))
    },
    getImage: function (product){
      return storage
        .child(`product_images/${product.slug}.jpg`)
        .getDownloadURL()
        .then(url => this.updateProductImage(product, url))
    },
    updateProductImage: function (product, url){
      return db
        .collection('products')
        .doc(product.slug)
        .set({ imageUrl: url, }, { merge: true })
    },
    remove: function (product){
      return db.collection('products')
        .doc(product.slug)
        .delete()
        .then(() => this.removeImage(product))
    },
    removeImage: function (product){
      return storage.child(`product_images/${product.slug}.jpg`)
        .delete()
        .then(data => {
          console.log('data', data);
        })
    },
    setPhoto: function (){
      this.newProduct.productPhoto = this.$refs.productPhoto.files[0]
    }
  }
}
</script>
