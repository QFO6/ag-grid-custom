<template>
  <div v-if="icon !== ''">
    <v-row class="mx-2">
      <span>
        {{ value }}
      </span>
      <v-spacer />
      <v-icon :color="color">
        {{ icon }}
      </v-icon>
    </v-row>
  </div>
  <div v-else>
    <v-row class="mx-2">
      <span>
        {{ value }}
      </span>
    </v-row>
  </div>
</template>

<script>
import { find, cloneDeep } from 'lodash'
import { isEmptyArray, isValidString } from '../utils'
import { AG_TABLE_RANK_ICONS_CONFIG } from '../utils/constants'

import cellRenderMixin from 'lib/mixins/cellRenderMixin'

export default {
  name: 'RankCellRenderer',
  mixins: [cellRenderMixin],
  props: {},
  data() {
    return {
      icon: '',
      value: '',
      color: '',
      rankIcons: cloneDeep(AG_TABLE_RANK_ICONS_CONFIG),
    }
  },
  computed: {},
  mounted() {
    this.value = this.params.value

    if (this.params && !Number.isNaN(Number(this.params.value)) && !isEmptyArray(this.rankIcons)) {
      const configItem = find(
        this.rankIcons,
        (item) => Number(this.params.value) === Number(item['rank'])
      )
      if (configItem && configItem['attrs']) {
        if (isValidString(configItem['attrs']['icon'])) {
          this.icon = configItem['attrs']['icon']
        }
        if (isValidString(configItem['attrs']['color'])) {
          this.color = configItem['attrs']['color']
        }
      }
    }
  },
}
</script>
