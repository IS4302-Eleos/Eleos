<template>
  <div>
    <eleos-navbar />
    <section class="main-content columns minheight">
      <div class="column is-12">
        <Nuxt />
      </div>
    </section>
    <eleos-footer />
  </div>
</template>

<script>
import EleosNavbar from '~/components/Navbar'
import EleosFooter from '~/components/Footer'

export default {
  name: 'DefaultLayout',
  components: {
    EleosNavbar,
    EleosFooter
  }
}
</script>

<style scoped>
.minheight {
  min-height: 82vh;
}
</style>
