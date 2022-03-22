<template>
  <div>
    <!--Please replace me-->
    <section class="section container">
      <h1> {{ title }} </h1>
      <p>
        The campaign address you are viewing is {{ $route.params.campaignAddress }}
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
  name: 'InfoPage',
  middleware: 'validCampaign',
  data () {
    return {
      title: 'Testing folder name as dynamic route'
    }
  }
}
</script>
