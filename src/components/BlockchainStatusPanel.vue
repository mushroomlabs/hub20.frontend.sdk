<template>
  <div class="blockchain-status-panel" :class="{synced, online}">
    <span class="current-block">{{ currentBlock }}</span>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters('network', {
      synced: 'IsNodeSynced',
      online: 'isNodeOnline',
      currentBlock: 'currentBlock',
    }),
  },
}
</script>
