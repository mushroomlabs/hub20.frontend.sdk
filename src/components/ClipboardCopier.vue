<template>
  <span class="clipboard-copier" @click="copyToClipboard">
    <slot>{{ value }}</slot>
  </span>
</template>

<script>
export default {
  name: 'clipboard-copier',
  props: {
    value: [String, Number],
  },
  methods: {
    copyToClipboard() {
      this.$copyText(this.value).catch(() => console.log('Failed to copy text'))
    },
  },
}
</script>
