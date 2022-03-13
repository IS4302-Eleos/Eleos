<template>
  <div>
    <!--Please replace me-->
    <section class="section container">
      <h1> {{ title }} </h1>
      <p v-if="validUserAddress">
        The user's address you are viewing is {{ $route.params.userAddress }}
      </p>
      <p v-else>
        Oops, this user address is not valid :(
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
      title: 'Testing file name as dynamic route',
      validUserAddress: true
    }
  }
}
</script>
