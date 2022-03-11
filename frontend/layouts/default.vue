<template>
  <div>
    <eleos-navbar />
    <section class="main-content columns">
      <div class="column is-10">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import EleosNavbar from '~/components/Navbar'

export default {
  name: 'DefaultLayout',
  components: {
    EleosNavbar
  }
}
</script>
