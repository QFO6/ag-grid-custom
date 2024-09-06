<template>
  <div v-if="enabled">
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn
          icon
          :small="small"
          :x-small="xSmall"
          :color="color"
          v-on="on"
          @click="toggleFullScreen"
        >
          <v-icon :size="iconSize">
            {{ btnIcon }}
          </v-icon>
        </v-btn>
      </template>
      <span>{{ btnTooltipText }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'AgFullScreen',
  props: {
    iconSize: {
      type: Number,
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: '',
    },
    targetSelector: {
      type: String,
    },
  },
  data() {
    return {
      isFullScreen: false,
      enabled: screenfull.isEnabled,
    }
  },
  computed: {
    btnIcon() {
      return this.isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'
    },
    btnTooltipText() {
      return this.isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'
    },
  },
  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.changeFullShow)
    }
  },
  destroyed() {
    screenfull.off('change', this.changeFullShow)
  },
  methods: {
    toggleFullScreen() {
      if (screenfull.isEnabled) {
        if (this.targetSelector) {
          const targetElement =
            document.getElementById(this.targetSelector) ||
            document.querySelector(this.targetSelector)
          if (targetElement) {
            screenfull.toggle(targetElement)
          } else {
            screenfull.toggle()
          }
        } else {
          screenfull.toggle()
        }
      }
    },
    changeFullShow() {
      this.isFullScreen = screenfull.isFullscreen
    },
  },
}
</script>

<style scoped></style>
