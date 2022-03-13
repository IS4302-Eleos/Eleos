<!--Anonymous Router, please do not modify-->
<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'CampaignAnonymousRouter',
  middleware ({ route, redirect, from }) {
    if (/\/campaign[/]{0,1}$/.test(route.path)) {
      return redirect('/campaign/add')
    }
  }
}
</script>
