<template>
  <div>
    <v-tooltip 
      v-if="tooltip"
      top
    >
      <template v-slot:activator="{ on, attrs }">
        <a
          :href="href"
          :target="target"
          :class="color ? `${color}--text` : ''"
          style="text-decoration: none"
          v-bind="attrs"
          v-on="on"
        >
          {{ value }}
        </a>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
    <a
      v-else
      :href="href"
      :target="target"
      :class="color ? `${color}--text` : ''"
      style="text-decoration: none"
    >
      {{ value }}
    </a>
  </div>
</template>

<script>
import cellRenderMixin from 'lib/mixins/cellRenderMixin'

export default {
  name: 'LinkCellRenderer',
  mixins: [cellRenderMixin],
  data() {
    return {
      href: '',
      value: '',
      route: '',
      color: '',
      target: '',
      tooltip: '',
    }
  },
  mounted() {
    this.value = this.params.value
    this.href = this.params.href || ''
    this.tooltip = this.params.tooltip || ''
    this.color = this.params.color || 'primary'
    this.target = this.params.target || '_blank'
  },
}
</script>
