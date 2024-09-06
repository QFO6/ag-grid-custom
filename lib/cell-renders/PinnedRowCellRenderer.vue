<template>
  <div style="width: 100%; height: 100%">
    <span
      :class="classes"
      style="width: 100%"
    >
      <b>{{ formattedValue }}</b>
    </span>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { isValidString } from '../utils'
import { AG_TABLE_COLORS } from '../utils/constants'

import cellRenderMixin from 'lib/mixins/cellRenderMixin'

export default {
  name: 'PinnedRowCellRenderer',
  mixins: [cellRenderMixin],
  props: {},
  data() {
    return {
      rawValue: '',
      formattedValue: '',
      color: cloneDeep(AG_TABLE_COLORS.PINNED_CELL),
    }
  },
  computed: {
    classes() {
      return this.params && this.params['toPercentage'] ? 'pl-4' : ''
    },
  },
  mounted() {
    if (
      this.params &&
      (isValidString(this.params.value) || typeof this.params.value === 'number')
    ) {
      this.rawValue = this.params.value
      if (isValidString(this.rawValue) && this.rawValue.charAt(this.rawValue.length - 1) === '%') {
        this.rawValue = this.rawValue.substring(0, this.rawValue.length - 1)
      }
      if (this.params['toPercentage']) {
        let tmpValue = 0.0
        if (!Number.isNaN(Number(this.rawValue))) {
          tmpValue = Number(Number(this.rawValue)).toFixed(2)
        }
        this.formattedValue = `${tmpValue}%`
      } else {
        this.formattedValue = this.rawValue
      }
    }
  },
}
</script>
