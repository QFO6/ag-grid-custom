<template>  
  <div class="d-flex justify-space-between">
    <span>{{ params.value }}</span>
    <v-menu
      v-if="tooltip"
      right
      offset-x
      open-on-hover
      max-width="300"
      max-height="700"
      nudge-right="10"
      nudge-top="20"
      origin="center center"
      transition="scale-transition"
      :close-on-content-click="false"
    >
      <template #activator="{ on: menu }">
        <v-icon
          dark
          small
          color="grey"
          class="icon"
          v-on="{ ...menu }"
        >
          {{ params.icon }}
        </v-icon>
      </template>

      <v-card raised>
        <v-card-text>
          <ul v-if="tooltip.length > 1">
            <li
              v-for="(item, index) in tooltip"
              :key="index"
            >
              <span v-text="tooltip[index]" />
            </li>
          </ul>
          <span
            v-else
            v-text="tooltip[0]"
          />
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import cellRenderMixin from 'lib/mixins/cellRenderMixin'

export default {
  name: "TooltipCellRenderer",
  mixins: [cellRenderMixin],
  data() {
    return {
      tooltip: null
    }
  },
  mounted() {
    this.tooltip = this.formatTooltip()
  },
  methods: {
    formatTooltip () {
      if (this.params.tooltip) {
        return this.params.tooltip.split('\n')
          .map(str => str.trim())
      }
    }
  }
}
</script>

<style scoped>
.icon {
  position: absolute;
  right: 8px;
  top: 50%; 
  transform: translateY(-50%);
}
.text-wrapper {
  white-space: pre-wrap;
  max-width: 250px;
}
</style>
