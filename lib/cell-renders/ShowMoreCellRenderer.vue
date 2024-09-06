<template>
  <div>
    <span v-html="highlight(params.valueFormatted)" />
    <div
      v-if="visible"
      class="text-center"
    >
      <v-menu
        v-model="menu"
        left
        offset-x
        open-on-hover
        max-width="600"
        max-height="700"
        nudge-top="50"
        origin="center center"
        transition="scale-transition"
        :close-on-content-click="false"
      >
        <template #activator="{ on: menu }">
          <v-tooltip top>
            <template #activator="{ on: tooltip }">
              <v-btn
                icon
                right
                bottom
                small
                absolute
                color="primary"
                class="ellipsis-btn"
                v-on="{ ...tooltip, ...menu }"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <span>Show more</span>
          </v-tooltip>
        </template>

        <v-card raised>
          <v-list-item-content class="px-2 pb-0">
            <v-list-item-subtitle
              v-if="params.data.TRIAL_ID"
              class="overline mb-2"
            >
              Trial ID {{ params.data.TRIAL_ID }}
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="params.data.REGISTRATION_NUMBER_CDE"
              class="overline mb-2"
            >
              实验编号： {{ params.data.REGISTRATION_NUMBER_CDE }}
            </v-list-item-subtitle>
            <v-list-item-title class="font-weight-medium text-capitalize">
              {{ params.colDef.headerName }}
            </v-list-item-title>
          </v-list-item-content>
          <v-card-text>
            <ul v-if="content.length > 1">
              <li
                v-for="(item, index) in content"
                :key="index"
              >
                <span v-html="highlight(content[index])" />
              </li>
            </ul>
            <span
              v-else
              v-html="highlight(content[0])"
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
import cellRenderMixin from 'lib/mixins/cellRenderMixin'

import { has, escape, isEmpty, escapeRegExp } from 'lodash'

export default {
  name: 'ShowMoreCellRenderer',
  mixins: [cellRenderMixin],
  data() {
    return {
      col: '',
      menu: false,
      rowIndex: -1,
      content: [],
      filters: null,
      visibleRows: [],
      colors: [
        '#c6e872',
        '#fccde2',
        '#fcbf69',
        '#c0c4f2',
        '#c19191',
        '#dee1ec',
        '#9ab5c1',
        '#dbe9b7',
        '#ffebb7',
      ],
    }
  },
  computed: {
    // Returns an array including the filter inputs applied on this column
    searchTerms() {
      if (!this.filters || !has(this.filters, this.col)) {
        return []
      }
      const filters = this.filters[this.col]
      const values = Object.keys(filters).reduce((acc, key) => {
        if (/(^filter$|condition\d+)/gi.test(key)) {
          const value =
            typeof filters[key] === 'object' ? filters[key]['filter'] : filters[key]
          acc.push(value)
        }
        return acc
      }, [])
      return values
    },
    // Returns true if the cell is in the column which has filters applied and is visible
    isActive() {
      return has(this.filters, this.col) && this.visibleRows.includes(this.rowIndex)
    },
    visible() {
      if (!this.params || !this.params.value || !this.params.valueFormatted)
        return false

      return this.params.value.length > this.params.valueFormatted.length
    },
  },
  mounted() {
    this.content = this.formatContent()
  },
  methods: {
    refresh(params) {
      this.params = params
      this.col = params.colDef.field
      this.rowIndex = params.rowIndex
      this.content = this.formatContent()
      this.filters = params.api.getFilterModel()
      this.visibleRows = this.getRowIndicesAfterFilter()
      return true
    },
    highlight(text) {
      // TODO: regex: handle stop words
      if (isEmpty(this.searchTerms) || !this.isActive) {
        return text
      }
      let content = text
      this.searchTerms.forEach((term, index) => {
        const regex = new RegExp(escapeRegExp(term), 'ig')
        content = content.replace(regex, matched => {
          return `<span style="background-color: ${this.colors[index]}; font-weight: 600;">${matched}</span>`
        })
      })
      return content
    },
    getRowIndicesAfterFilter() {
      const rowIndices = []
      this.params.api.forEachNodeAfterFilter(node => {
        rowIndices.push(node.rowIndex)
      })
      return rowIndices
    },
    // Splits string content by '\n', and converts the characters "&", "<",
    // ">", '"', and "'" in string to their corresponding HTML entities.
    formatContent() {
      if (typeof this.params.value !== 'string') {
        return [this.params.value]
      }
      return this.params.value
        .split('\n')
        .filter(str => str.trim().length > 0)
        .map(str => escape(str))
    },
    // escapeRegExp (string) {
    //   return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    // }
  },
}
</script>

<style scoped>
.ellipsis-btn {
  bottom: 4px !important;
  right: 16px !important;
  background-color: transparent !important;
}
</style>
