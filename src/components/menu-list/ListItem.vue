<template>
  <div>
    <v-list-item
      exact
      color="primary"
      :href="menuInfo.href"
      :two-line="Boolean(menuInfo.subtitle)"
      :target="menuInfo.href ? '_blank' : ''"
      :to="menuInfo.location"
      :disabled="menuInfo.disabled"
      :input-value="isListItemActive"
      :class="menuInfo.disabled ? 'is-disabled' : ''"
      @click="onMenuChanged(menuInfo.name)"
    >
      <v-list-item-icon v-if="itemIconVisible(menuInfo)">
        <v-tooltip
          v-if="enableTooltip"
          right
          nudge-right="15"
        >
          <template #activator="{ on }">
            <v-icon v-on="on">
              {{ menuInfo.icon }}
            </v-icon>
          </template>
          <span>{{ menuInfo.title }}</span>
        </v-tooltip>
        <v-icon v-else>
          {{ menuInfo.icon }}
        </v-icon>
      </v-list-item-icon>
      <v-tooltip
        v-if="enableTooltip"
        right
        nudge-right="15"
      >
        <template #activator="{ on }">
          <v-list-item-content v-on="on">
            <v-list-item-title class="text-wrap">
              {{ menuInfo.title }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <span>{{ menuInfo.title }}</span>
      </v-tooltip>
      <v-list-item-content v-else>
        <v-list-item-title class="text-wrap">
          {{ menuInfo.title }}
        </v-list-item-title>
        <v-list-item-subtitle
          v-if="menuInfo.subtitle"
          class="text-wrap"
        >
          {{ menuInfo.subtitle }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="menuInfo.action">
        <v-icon>
          {{ menuInfo.action }}
        </v-icon>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
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
  computed: {
    isListItemActive() {
      return this.menuInfo.name === this.$route.name
    },
  },
  methods: {
    onMenuChanged() {
      this.$emit('menu-changed', {})
    },
    itemIconVisible(item) {
      return typeof item.icon === 'string' && item.icon.indexOf('mdi-') === 0
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
