<template>
  <div class="hero is-success">
    <div class="hero-body">
      <figure class="image is-128x128">
        <img class="is-rounded" src="https://scontent.fsin5-1.fna.fbcdn.net/v/t1.6435-9/80479012_1393422380839451_7183826706619170816_n.png?_nc_cat=110&ccb=1-5&_nc_sid=9267fe&_nc_ohc=_FF-WrWb4okAX-GgI5M&_nc_ht=scontent.fsin5-1.fna&oh=00_AT80cLmyd4mRkDOOXNbinKXyqdIbxv-0EJ3cBeyf6Bo4yA&oe=6262D3A7" alt="Placeholder image">
      </figure>
      <p class="subtitle mt-6">
        {{ address }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserHeader',
  props: {
    address: {
      type: String,
      default: null,
      required: true
    }
  }
}
</script>
