<template>
  <div class="blockchain-route-countdown-circle" :class="{expired, online, synced}">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="counter">
        <circle cx="50" cy="50" :r="circleRadius" />
        <path
          :class="{warning: isInWarningInterval, critical: isInCriticalInterval}"
          :stroke-dasharray="circleDasharray"
          :d="drawPathString"
        />
      </g>
    </svg>
    <span class="label">
      <span class="countdown">{{ blocksRemaining }} / {{ blockInterval }}</span>
    </span>
  </div>
</template>

<script>
import {BlockchainMixin} from '../../../mixins/network'

const CIRCLE_RADIUS = 35
const WARNING_THRESHOLD = 30
const CRITICAL_THRESHOLD = 15

export default {
  name: 'blockchain-payment-route-countdown-circle',
  mixins: [BlockchainMixin],
  props: {
    route: {
      type: Object,
    },
    chain: {
      type: Object,
    }
  },
  data() {
    return {
      circleRadius: CIRCLE_RADIUS,
    }
  },
  computed: {
    expired() {
      return this.currentBlock && this.currentBlock >= this.route.expiration_block
    },
    blockInterval() {
      return this.route.expiration_block - this.route.start_block
    },
    blocksRemaining() {
      if (this.expired) {
        return 0
      }
      return this.route.expiration_block - this.currentBlock
    },
    isInWarningInterval() {
      return CRITICAL_THRESHOLD < this.percentage && this.percentage <= WARNING_THRESHOLD
    },
    isInCriticalInterval() {
      return CRITICAL_THRESHOLD >= this.percentage
    },
    remainingRatio() {
      return this.blocksRemaining / this.blockInterval
    },
    drawPathString() {
      return [
        `M 50, 50`,
        `m -${this.circleRadius}, 0`,
        `a ${this.circleRadius},${this.circleRadius} 0 1,0 ${2 * this.circleRadius},0`,
        `a ${this.circleRadius},${this.circleRadius} 0 1,0 -${2 * this.circleRadius},0`,
      ].join('\n')
    },
    percentage() {
      return Math.round(100 * this.remainingRatio)
    },
    circleLength() {
      return Math.ceil(2 * Math.PI * this.circleRadius)
    },
    circleDasharray() {
      return `${(this.remainingRatio * this.circleLength).toFixed(0)} ${this.circleLength}`
    },
  },
}
</script>

<style scoped lang="scss">
$ring_size: 7px !default;
$base_color: rgb(65, 184, 131) !default;
$warning_color: yellow;
$critical_color: red;

.blockchain-route-countdown-circle {
  position: relative;

  svg {
    // transform: scaleX(-1);
  }

  g.counter {
    /* Removes SVG styling that would hide the time label */
    fill: none;
    stroke: none;

    /* The SVG path that displays the timer's progress */
    circle {
      stroke-width: $ring_size;
      stroke: grey;
    }
    path {
      @keyframes rotate {
        100% {
          transform: rotate(360deg);
        }
      }

      stroke-width: $ring_size;
      stroke-linecap: round;
      transform: rotate(90deg);
      transform-origin: center;
      animation: rotate 2s ease-in-out infinite;
      transition: 10s linear all;

      stroke: $base_color;

      &.warning {
        stroke: $warning_color;
      }

      &.critical {
        stroke: $critical_color;
      }
    }
  }
}
</style>
