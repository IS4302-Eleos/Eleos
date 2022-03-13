<!--Anonymous Router, please do not modify-->
<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'CampaignInfoAnonymousRouter',
  middleware ({ route, redirect, from }) {
    if (/\/campaign[/][A-Fa-f0-9]{0,3}[/]{1}$/.test(route.path)) {
      return redirect(route.path + 'info')
    } else if (/\/campaign[/][A-Fa-f0-9]{0,3}$/.test(route.path)) {
      return redirect(route.path + '/info')
    }
  }
}
</script>
