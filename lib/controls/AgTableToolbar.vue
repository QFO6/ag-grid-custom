<template>
  <v-app-bar
    color="white"
    dense
    flat
    class="ag-table-toolbar"
  >
    <slot name="toolbar.before.start" />
    <ag-table-filter
      style="width: 26%"
      :visible="searchable"
      :grid-options="gridOptions"
    />
    <slot name="toolbar.after.start" />
    <v-spacer />
    <slot name="toolbar.before.end" />

    <ag-table-exporter
      v-if="exportable"
      class="mx-1"
      v-bind="exportOptions"
      :grid-options="gridOptions"
      :dataset-name="datasetName"
      :show-text="showText"
      :ssrm-params="ssrmParams"
      dialog-title="Export Options"
      :add-excel-data="addExcelData"
      :all-row-data-cb-fn="allRowDataCbFn"
      :all-row-data-cb-fn-params="allRowDataCbFnParams"
    />

    <base-full-screen
      v-if="targetFsSelector"
      small
      :target-selector="targetFsSelector"
      class="mx-1"
    />

    <ag-table-reset
      v-if="resettable"
      :grid-options="gridOptions"
      class="mx-1"
      @grid-refresh-request="onResetAgTableClicked"
    />

    <ag-table-page-size
      v-if="pageSizeResizable"
      class="mx-1"
      :grid-options="gridOptions"
    />

    <slot name="toolbar.after.end" />
  </v-app-bar>
</template>

<script>
import AgTableReset from 'lib/controls/AgTableReset'
import BaseFullScreen from 'lib/controls/AgFullScreen'
import AgTableFilter from 'lib/controls/AgTableFilter'
import AgTableExporter from 'lib/controls/AgTableExporter'
import AgTablePageSize from 'lib/controls/AgTablePageSize'
import { has } from 'lodash'

export default {
  name: 'AgTableToolbar',
  components: {
    AgTableReset,
    AgTableFilter,
    BaseFullScreen,
    AgTableExporter,
    AgTablePageSize,
  },
  props: {
    gridOptions: {
      type: Object,
      required: true,
    },
    exportOptions: {
      type: Object,
      default: function () {
        return {}
      },
    },
    datasetName: {
      type: String,
    },
    menuLabel: {
      type: String,
      default: 'columns',
    },
    menuPrependIcon: {
      type: String,
      default: 'mdi-format-list-bulleted',
    },
    showText: {
      type: Boolean,
      default: false,
    },
    resettable: {
      type: Boolean,
      default: true,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    exportable: {
      type: Boolean,
      default: true,
    },
    pageSizeResizable: {
      type: Boolean,
      default: false,
    },
    targetFsSelector: {
      type: String,
    },
    allRowDataCbFn: {
      type: Function,
    },
    // for exporting ssrm all row data
    ssrmParams: {
      type: Object,
      default: function () {
        return null
      },
    },
    allRowDataCbFnParams: {
      type: Object,
      validator: function (value) {
        return has(value, 'title') && has(value, 'search_id')
      },
    },
    // only for exporting excel, the additional sheets
    addExcelData: {
      type: Array,
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'sheetData')) return false
        }
        return true
      },
    },
  },
  computed: {},
  methods: {
    onResetAgTableClicked() {
      this.$emit('grid-refresh-request')
    }
  },
}
</script>

<style>
.ag-table-toolbar .v-toolbar__content {
  padding: 0px !important;
}
</style>
