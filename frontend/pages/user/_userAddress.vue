<template>
  <div>
    <!--Please replace me-->
    <section class="section container">
      <h1> {{ title }} </h1>
      <p>
        The user's address you are viewing is {{ $route.params.userAddress }}
      </p>
      <NuxtLink to="/">
        Back to home!
      </NuxtLink>
    </section>
    <!--end of me-->
  </div>
</template>

<script>
export default {
  name: 'UserPage',
  data () {
    return {
      title: 'Testing file name as dynamic route'
    }
  }
}
</script>
