<!--Anonymous Router, please do not modify-->
<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'CampaignInfoAnonymousRouter',
  middleware ({ route, redirect, from }) {
    // Reroute to '/' directory if invalid address
    const validAddress = /^[0-9a-fA-F]{1,3}$/.test(route.params.campaignAddress)
    if (!validAddress) {
      return redirect('/')
    }

    if (/\/campaign[/][0-9a-fA-F]{1,3}[/]{1,3}/.test(route.path)) {
      return redirect(route.path + 'info')
    } else if (/\/campaign[/][0-9a-fA-F]{1,3}/.test(route.path)) {
      return redirect(route.path + '/info')
    }
  }
}
</script>
