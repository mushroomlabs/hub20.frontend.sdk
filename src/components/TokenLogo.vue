<template>
  <img v-if="token.logoURI" class="token-logo" :src="token.logoURI" :alt="token.symbol" />
</template>

<script>
export default {
  name: 'token-logo',
  props: {
    token: Object,
  },
}
</script>
