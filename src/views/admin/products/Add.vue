<template>
  <div
    class="modal"
    v-bind:class="{'is-active': modalIsOpen}"
  >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add New Product</p>
        <button
          class="delete"
          aria-label="close"
          @click="modalIsOpen = false"
        ></button>
      </header>
      <section class="modal-card-body">
        <form action="">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="Ground Coffee, etc." v-model="product.name">
            </div>
          </div>

          <div class="field">
            <label class="label">Price</label>
            <div class="control">
              <input class="input" type="number" placeholder="8.99" v-model="product.price">
            </div>
          </div>

          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea class="textarea" placeholder="Describe the item for the user" v-model="product.description"></textarea>
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
                {{product.productPhoto.name}}
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
        <button
          class="button"
        >
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
  import {storage, PRODUCTS_COLLECTION} from '../../../firebase'
  import {slugify} from '../../../helpers/slugify'

  export default {
    name: "AdminProductsAddModal",
    props: [
      'isOpen',
      'product',
    ],
    computed: {
      modalIsOpen: {
        get: function (){
          return this.isOpen
        },
        set: function (value){
          this.$emit('update:addModalOpen', value)
        }
      }
    },
    methods: {
      save: function (){
        const {name, price, description} = this.product
        const slug = this.product.slug = slugify(name)

        PRODUCTS_COLLECTION.doc(slug).set({
          name,
          slug,
          price,
          description
        })
        .then(() => this.closeModal() )
        .then(() => this.storeImage(this.product))
        .then(() => this.resetProduct() )
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
        return PRODUCTS_COLLECTION
          .doc(product.slug)
          .set({ imageUrl: url, }, { merge: true })
      },
      setPhoto: function (){
        this.product.productPhoto = this.$refs.productPhoto.files[0]
      },
      closeModal: function (){
        this.modalIsOpen = false
      },
      resetProduct: function (){
        this.product.name = ''
        this.product.slug = ''
        this.product.price = ''
        this.product.description = ''
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
