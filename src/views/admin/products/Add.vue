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
            <label class="label">Brand</label>
            <div class="control">
              <input class="input" type="text" placeholder="Cafe Moto, Cafe Virtuoso, etc." v-model="product.brand">
            </div>
          </div>
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="Ground Coffee, etc." v-model="product.name" v-bind:class="{'is-danger': !product.name}">
            </div>
            <p class="help is-danger" v-if="!product.name">
              This field is required
            </p>
          </div>
          <div class="field">
            <label class="label">Blend</label>
            <div class="control">
              <input class="input" type="text" placeholder="Light, Medium, Dark, etc." v-model="product.blend">
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

          <div class="field">
            <label class="label">Displayed?</label>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="radio" for="displayed-yes">
                    <input
                      type="radio"
                      name="displayed"
                      v-model="product.displaying"
                      id="displaying-yes"
                      value="true"
                    >
                    Yes
                  </label>
                  <label class="radio" for="displayed-no">
                    <input
                      type="radio"
                      name="displayed"
                      v-model="product.displaying"
                      id="displayed-no"
                      value="false"
                    >
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="field" style="margin-bottom: 40px;">
            <label class="label">In Stock</label>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="radio" for="available-yes">
                    <input
                      type="radio"
                      name="available"
                      v-model="product.available"
                      id="available-yes"
                      value="true"
                    >
                    Yes
                  </label>
                  <label class="radio" for="available-no">
                    <input
                      type="radio"
                      name="available"
                      v-model="product.available"
                      id="available-no"
                      value="false"
                    >
                    No
                  </label>
                </div>
              </div>
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
          @click="save(product)"
          v-bind:disabled="!product.name"
        >
          Save changes
        </button>
        <button
          class="button"
          @click="closeModal()"
        >
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import { storage, PRODUCTS_COLLECTION } from "../../../configs";
import { slugify } from "../../../helpers/slugify";

export default {
  name: "AdminProductsAddModal",
  props: ["isOpen", "product"],
  computed: {
    modalIsOpen: {
      get: function() {
        return this.isOpen;
      },
      set: function(value) {
        this.$emit("update:addModalOpen", value);
      }
    }
  },
  methods: {
    save: function(product) {
      const {
        brand,
        name,
        blend,
        description,
        price,
        size,
        displaying,
        available
      } = product;

      const slug = (product.slug = slugify(product.name));

      let imageUrl = this.$refs.productPhoto.files.length ?
        null : product.imageUrl;

      let data = {
        ...(brand && { brand }),
        ...(name && { name }),
        ...(blend && { blend }),
        ...(description && { description }),
        ...(price && { price }),
        ...(slug && { slug }),
        ...(size && { size }),
        ...(imageUrl && { imageUrl }),
        displaying: JSON.parse(displaying),
        available: JSON.parse(available)
      }

      let ref = PRODUCTS_COLLECTION.doc(slug)
      ref.get().then(product => {
        if (product.exists) {
          let promise = ref.update(data)
          promise.then(cleanup.bind(this))
        } else {
          let promise = ref.set(data)
          promise.then(cleanup.bind(this))
        }
      })

      function cleanup(){
        return this.closeModal()
      }

      // if (this.$refs.productPhoto.files.length) {
      //   promise.then(() => this.storeImage(product));
      // }
      // promise.then(() => this.closeModal()).catch(() => {});
    },
    storeImage: function(product) {
      return storage
        .child(`product_images/${product.slug}.jpg`)
        .put(product.productPhoto)
        .then(() => this.getImage(product));
    },
    getImage: function(product) {
      return storage
        .child(`product_images/${product.slug}.jpg`)
        .getDownloadURL()
        .then(url => this.updateProductImage(product, url));
    },
    updateProductImage: function(product, url) {
      return PRODUCTS_COLLECTION.doc(product.slug).set(
        { imageUrl: url },
        { merge: true }
      );
    },
    setPhoto: function() {
      this.product.productPhoto = this.$refs.productPhoto.files[0];
    },
    closeModal: function() {
      this.modalIsOpen = false;
    },
    resetProduct: function() {
      this.product.brand = "";
      this.product.name = "";
      this.product.blend = "";
      this.product.description = "";
      this.product.price = "";
      this.product.size = "12oz";
      this.product.displaying = false;
      this.product.available = true;
      this.product.slug = "";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
