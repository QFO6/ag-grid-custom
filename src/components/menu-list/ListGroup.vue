<template>
  <div>
    <v-list-group
      no-action
      :value="isListGroupActive"
      :disabled="menuInfo.disabled"
      :class="menuInfo.disabled ? 'is-disabled' : ''"
    >
      <template
        v-if="menuInfo.icon"
        #prependIcon
      >
        <v-tooltip
          v-if="enableTooltip"
          right
          nudge-right="15"
        >
          <template #activator="{ on }">
            <v-icon
              v-on="on"
              v-text="menuInfo.icon"
            />
          </template>
          <span>{{ menuInfo.title }}</span>
        </v-tooltip>
        <v-icon
          v-else
          v-text="menuInfo.icon"
        />
      </template>
      <template #activator>
        <v-tooltip
          v-if="enableTooltip"
          right
          nudge-right="80"
        >
          <template #activator="{ on }">
            <v-list-item-content v-on="on">
              <v-list-item-title
                class="text-wrap"
                :class="menuInfo.disabled ? 'is-disabled' : ''"
                v-text="menuInfo.title"
              />
            </v-list-item-content>
          </template>
          <span>{{ menuInfo.title }}</span>
        </v-tooltip>
        <v-list-item-content v-else>
          <v-list-item-title
            class="text-wrap"
            :class="menuInfo.disabled ? 'is-disabled' : ''"
            v-text="menuInfo.title"
          />
        </v-list-item-content>
      </template>

      <slot />
    </v-list-group>
  </div>
</template>

<script>
export default {
  name: 'ListGroup',
  props: {
    menuInfo: {
      default: function () {
        return null
      },
      type: Object,
    },
    enableTooltip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    isListGroupActive() {
      if (typeof this.menuInfo.expand === 'undefined') {
        return this.menuInfo.name === this.$route.name
      } else {
        return this.menuInfo.expand
      }
    },
  },
  watch: {},
  methods: {
    onListGroupClick(location) {
      this.$router.push(location)
    },
  },
}
</script>

<style scoped>
.is-disabled {
  pointer-events: none;
  color: rgba(255, 255, 255, 0.5) !important;
}
.is-disabled .v-icon {
  color: rgba(255, 255, 255, 0.5) !important;
}
</style>
