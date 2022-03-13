<!--Anonymous Router, please do not modify-->
<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'UserAnonymousRouter',
  middleware ({ route, redirect, from }) {
    if (/\/user[/]{0,1}$/.test(route.path)) {
      return redirect('/')
    }
  }
}
</script>
