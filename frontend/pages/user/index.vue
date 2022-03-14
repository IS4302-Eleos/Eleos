<!--Anonymous Router, please do not modify-->
<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'UserAnonymousRouter',
  middleware ({ route, redirect, from }) {
    const invalidUserPath = /\/user[/]{0,1}$/.test(route.path)
    if (invalidUserPath) {
      return redirect('/')
    }
  }
}
</script>
