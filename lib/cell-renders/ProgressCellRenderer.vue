<template>
  <div
    v-if="value > 0"
    style="width: 100%; height: 100%"
  >
    <v-progress-linear
      :value="value"
      :color="color"
      height="100%"
    >
      <template #default>
        <span
          class="pl-4"
          style="width: 100%"
        >{{ formattedValue }}</span>
      </template>
    </v-progress-linear>
  </div>
  <div v-else>
    <span
      class="pl-4"
      style="width: 100%"
    >
      {{ formattedValue }}
    </span>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { isValidString } from '../utils'
import { AG_TABLE_COLORS } from '../utils/constants'

import cellRenderMixin from 'lib/mixins/cellRenderMixin'

export default {
  name: 'ProgressCellRenderer',
  mixins: [cellRenderMixin],
  props: {},
  data() {
    return {
      value: 0,
      rawValue: '',
      formattedValue: '',
      color: cloneDeep(AG_TABLE_COLORS.PROGRESS_CELL),
    }
  },
  computed: {},
  mounted() {
    if (
      this.params &&
      (isValidString(this.params.value) || typeof this.params.value === 'number')
    ) {
      this.rawValue = this.params.value
      if (isValidString(this.rawValue) && this.rawValue.charAt(this.rawValue.length - 1) === '%') {
        this.rawValue = this.rawValue.substring(0, this.rawValue.length - 1)
      }
      if (!Number.isNaN(Number(this.rawValue))) {
        this.value = Number(Number(this.rawValue)).toFixed(2)
        this.formattedValue = `${this.value}%`
      }
    }
  },
}
</script>
