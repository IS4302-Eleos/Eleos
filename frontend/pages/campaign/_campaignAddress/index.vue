<!--Anonymous Router, please do not modify-->
<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'CampaignInfoAnonymousRouter',
  middleware ({ route, redirect, from }) {
    const ifInvalidPath = /[/]campaign[/].+[/]{0,1}$/.test(route.path)
    if (ifInvalidPath) {
      return redirect('/campaign/' + route.params.campaignAddress + '/info')
    }
  }
}
</script>
