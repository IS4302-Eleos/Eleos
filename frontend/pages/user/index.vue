<!--Anonymous Router, please do not modify-->
<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'UserAnonymousRouter',
  middleware ({ route, redirect, from }) {
    const validUserAddress = /^[0-9a-fA-F]{1,3}$/.test(route.params.userAddress)
    if (!validUserAddress) {
      return redirect('/')
    }
    if (/\/user[/]{0,1}$/.test(route.path)) {
      return redirect('/')
    }
  }
}
</script>
