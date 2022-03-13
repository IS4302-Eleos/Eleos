<template>
  <div>
    <!--Please replace me-->
    <section class="section container">
      <h1> {{ title }} </h1>
      <NuxtLink to="/">
        Back to home!
      </NuxtLink>
    </section>
    <!--end of me-->
  </div>
</template>

<script>
export default {
  name: 'EditPage',
  data () {
    return {
      title: 'Sample Edit Page'
    }
  }
}
</script>
