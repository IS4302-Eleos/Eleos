<template>
  <b-taglist attached>
    <b-tag v-if="prefix" :size="size" rounded class="is-hidden-touch">
      {{ prefix }}
    </b-tag>
    <b-tag :type="addressType" :size="size" rounded class="is-hidden-touch">
      <NuxtLink :to="`/${type}/${address}`" class="is-family-monospace">
        {{ address }}
      </NuxtLink>
    </b-tag>
    <b-tag :type="addressType" :size="size" rounded ellipsis class="is-hidden-desktop">
      <NuxtLink :to="`/${type}/${address}`" class="is-family-monospace">
        {{ address }}
      </NuxtLink>
    </b-tag>
    <b-tag v-if="hasReputation" type="is-info is-light" :size="size" rounded>
      <b-tooltip label="Reputation Score" size="is-small" type="is-dark">
        {{ reputation }}
      </b-tooltip>
    </b-tag>
  </b-taglist>
</template>

<script>
export default {
  name: 'EthereumAddress',
  props: {
    address: {
      type: String,
      default: null,
      required: true
    },
    prefix: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'user'
    },
    showReputation: {
      type: Boolean,
      default: false
    },
    addressType: {
      type: String,
      default: 'is-primary'
    },
    size: {
      type: String,
      default: 'is-small'
    }
  },
  data () {
    return {
      reputation: this.$store.state.contract.reputation.userReputations[this.address]
    }
  },
  computed: {
    hasReputation () {
      return this.showReputation && this.reputation
    }
  },
  mounted () {
    if (this.showReputation && !this.reputation) {
      this.$store.dispatch('contract/reputation/getReputation', this.address).then((rep) => { this.reputation = rep })
    }
  }
}
</script>
