<template>
  <div>
    <eleos-navbar />
    <section class="main-content columns">
      <div class="column is-10">
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
