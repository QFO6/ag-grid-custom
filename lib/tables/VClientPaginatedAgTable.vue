<template>
  <div :id="id">
    <div v-if="!hide">
      <ag-table-toolbar
        class="px-2"
        v-bind="formattedToolbarOptions"
        :grid-options="totalGridOptions"
        :dataset-name="datasetName"
        @grid-refresh-request="onResetAgTableClicked"
      />
      <!-- Table prepend content -->
      <slot name="body.prepend" />
      <ag-grid-vue
        :class="theme"
        :side-bar="sideBar"
        :style="{ width, height: gridHeight }"
        :context="context"
        :row-data="rowData"
        :column-defs="totalColumnDefs"
        :grid-options="totalGridOptions"
        :default-col-def="totalDefaultColDef"
        :auto-group-column-def="autoGroupColumnDef"
        :default-csv-export-params="defaultCsvExportParams"
        :default-excel-export-params="defaultExcelExportParams"
        :overlay-no-rows-template="overlayNoRowsTemplate"
        :edit-type="editType"
        :pinned-top-row-data="pinnedTopRowData"
        :pinned-bottom-row-data="pinnedBottomRowData"
        @grid-ready="onGridReady"
        @column-resized="onColumnResized"
        @column-visible="onColumnResized"
        @column-group-opened="onColumnResized"
        @viewport-changed="onViewportChanged"
        @selection-changed="onRowSelectionChanged"
        @pagination-changed="onPaginationChanged"
        @first-data-rendered="onFirstDataRendered"
        @cell-value-changed="onCellValueChanged"
        @row-value-changed="onRowValueChanged"
        @row-editing-started="onRowEditingStarted"
        @row-editing-stopped="onRowEditingStopped"
        @row-data-changed="onRowDataChanged"
        @row-data-updated="onRowDataUpdated"
        @grid-columns-changed="onGridColumnsChanged"
        @virtual-columns-changed="onVirtualColumnsChanged"
        @column-row-group-changed="onColumnRowGroupChanged"
      />
      <!-- Table append content -->
      <slot name="body.append" />
    </div>
    <base-no-data-placeholder
      v-else
      :title="noRowsText"
      :message="noRowsMessage"
    />
  </div>
</template>

<script>
import gridMixin from 'lib/mixins/gridMixin'
import exportMixin from 'lib/mixins/exportMixin'

// `VClientPaginatedAgTable` implements the ag-grid [Client-Side](https://ag-grid.com/vue-data-grid/client-side-model/) with pagination enabled by default.
export default {
  name: 'VClientPaginatedAgTable',
  mixins: [gridMixin, exportMixin],
  props: {
    // Table height in [length units](https://www.w3schools.com/cssref/css_units.asp) or % | 1. If using `%` for your height, then make sure the container you are putting the grid into also has height specified;
    // <br />if the parent has no height, then this `%` will always be zero.<br />2. To allow the grid to auto-size it's height to fit rows, you may set grid property `domLayout: 'autoHeight'`, which is 'normal' by default.
    // <br />**Note**: if set `domLayout: 'autoHeight'`, then the explicit `height` won't apply. <br />See [Grid Auto Height](https://www.ag-grid.com/javascript-data-grid/grid-size/#grid-auto-height)
    height: {
      type: String,
      default: '500px',
    },
    // Table row data described in [Ag Grid](https://ag-grid.com/vue-data-grid/grid-options/#reference-clientRowModel-rowData)
    rowData: {
      type: Array,
      default: function () {
        return null
        // return []
      },
    },
    // The auto group column definitions
    // <br />More details please refer [here](https://ag-grid.com/vue-data-grid/grid-options/#reference-rowGrouping-autoGroupColumnDef)
    autoGroupColumnDef: {
      type: Object,
      default: function () {
        return {}
      },
    },
    // Auto all columns size
    // <br />More details please refer [here](https://ag-grid.com/vue-data-grid/column-api/#reference-Sizing-autoSizeAllColumns)
    autoSizeAllColumns: {
      type: Boolean,
      default: false,
    },
    // Gets the grid to size the columns to the specified width in pixels
    // <br />More details please refer [here](https://ag-grid.com/vue-data-grid/column-api/#reference-Sizing-sizeColumnsToFit)
    sizeColumnsToFit: {
      type: Boolean,
      default: false,
    },
    // Pin the first column
    pinFirstCol: {
      type: Boolean,
      default: false,
    },
    // Pin the last column
    pinLastCol: {
      type: Boolean,
      default: false,
    },
    // Pin the top row item
    pinTopRow: {
      type: Boolean,
      default: false,
    },
    // Pin the bottom row item
    pinBottomRow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      totalColumnDefs: null,
      totalDefaultColDef: {
        filter: 'agTextColumnFilter',
        sortable: true,
        resizable: true,
        // headerClass: 'wrap-header-text'
      },
      totalGridOptions: {
        // headerHeight: 75,
        domLayout: 'normal',
        tooltipShowDelay: 500,
        suppressDragLeaveHidesColumns: true,
        statusBar: {
          statusPanels: [
            { statusPanel: 'agTotalRowCountComponent', align: 'left' },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
            { statusPanel: 'agAggregationComponent' },
          ],
        },
      },
    }
  },
  created() {
    this.id = `client-paged-table-${new Date().getTime()}`
    // TODO: deep merge (nested object)
    this.getGridOptions()
    this.getDefaultColDef()
    this.totalColumnDefs = this.getColumnDefs()

    console.log('VClientPaginatedAgTable columnDefs: ', this.totalColumnDefs)
  },
  methods: {
    // @vuese
    // Handle the ag grid ready event([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-miscellaneous-gridReady)) and fire to parent component
    // @arg The grid parameters
    onGridReady(params) {
      this.gridApi = params.api
      this.gridColumnApi = params.columnApi
      // Fire when the ag grid is ready
      // <br />More details parameters refer [here](https://ag-grid.com/vue-data-grid/grid-events/#reference-miscellaneous-gridReady)
      // @arg The grid parameters
      this.$emit('grid-ready', params)
    },
    // @vuese
    // Handle the ag grid column resized([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-columns-columnResized)) event
    // @arg The grid parameters
    onColumnResized(params) {
      params.api.resetRowHeights()
    },
    // @vuese
    // Handle the ag grid row selection changed event([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-selection-selectionChanged)) and fire to parent component
    // @arg The grid parameters
    onRowSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows()
      // Fire when the row selection changed
      // <br />More details parameters refer [here](https://ag-grid.com/vue-data-grid/grid-events/#reference-selection-selectionChanged)
      // @arg The selected row items
      this.$emit('row-selection-changed', selectedRows)
    },
    // @vuese
    // Handle the ag grid first data rendered event([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-miscellaneous-firstDataRendered)) and fire to parent component
    // @arg The grid parameters
    onFirstDataRendered(params) {
      if (this.pinFirstCol) this.setFirstColPinned()
      if (this.pinLastCol) this.setLastColPinned()
      if (this.pinTopRow) this.setTopRowPinned()
      if (this.pinBottomRow) this.setBottomRowPinned()
      if (this.sizeColumnsToFit) this.sizeToFit()
      if (this.autoSizeAllColumns) this.autoSizeAll(params)

      // Fire when the first data rendered in ag grid
      // <br />More details parameters refer [here](https://ag-grid.com/vue-data-grid/grid-events/#reference-miscellaneous-firstDataRendered)
      // @arg The grid parameters
      this.$emit('first-data-rendered', params)
    },
    // @vuese
    // Handle the ag grid pagination changed event([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-pagination-paginationChanged)) and fire to parent component
    // @arg The grid parameters
    onPaginationChanged(params) {
      // Fire when the pagination is changed
      // <br />More details parameters refer [here](https://ag-grid.com/vue-data-grid/grid-events/#reference-pagination-paginationChanged)
      // @arg The grid parameters
      this.$emit('pagination-changed', params)
    },
    // @vuese
    // Handle the ag grid view port changed event([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-miscellaneous-viewportChanged)) and fire to parent component
    // @arg The grid parameters
    onViewportChanged(params) {
      // Fire when the table view port is changed
      // <br />More details parameters refer [here](https://ag-grid.com/vue-data-grid/grid-events/#reference-miscellaneous-viewportChanged)
      // @arg The grid parameters
      this.$emit('viewport-changed', params)
    },
    // @vuese
    // Handle the ag grid row data changed event and fire to parent component
    // @arg The grid parameters
    onRowDataChanged(params) {
      // Fire when the row data is changed
      // @arg The grid parameters
      this.$emit('row-data-changed', params)
    },
    // @vuese
    // Handle the ag grid row data updated event([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-clientRowModel-rowDataUpdated)) and fire to parent component
    // @arg The grid parameters
    onRowDataUpdated(params) {
      // Fire when the row data is updated
      // <br />More details parameters refer [here](https://ag-grid.com/vue-data-grid/grid-events/#reference-clientRowModel-rowDataUpdated)
      // @arg The grid parameters
      this.$emit('row-data-updated', params)
    },
    // @vuese
    // Handle the ag-grid gridColumnsChanged event([details](https://www.ag-grid.com/javascript-data-grid/grid-events/#reference-columns-gridColumnsChanged)) and fire to parent component
    // @arg The grid parameters
    onGridColumnsChanged(params) {
      if (this.sizeColumnsToFit) this.sizeToFit()
      if (this.autoSizeAllColumns) this.autoSizeAll(params)

      // Fire when the list of grid columns changed
      // <br />More details parameters refer [here](https://www.ag-grid.com/javascript-data-grid/grid-events/#reference-columns-gridColumnsChanged)
      // @arg The grid parameters
      this.$emit('grid-columns-changed', params)
    },
    // @vuese
    // Handle the ag grid column group changed event([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-clientRowModel-columnRowGroupChanged)) and fire to parent component
    // @arg The grid parameters
    onColumnRowGroupChanged(params) {
      // Fire when the column row group is changed
      // <br />More details parameters refer [here](https://ag-grid.com/vue-data-grid/grid-events/#reference-clientRowModel-columnRowGroupChanged)
      // @arg The grid parameters
      this.$emit('column-row-group-changed', params)
    },
    // @vuese
    // Handle the ag grid virtual columns changed event([details](https://ag-grid.com/vue-data-grid/grid-events/#reference-clientRowModel-virtualColumnsChanged)) and fire to parent component
    // @arg The grid parameters
    onVirtualColumnsChanged(params) {
      if (this.autoSizeAllColumns) this.autoSizeAll(params)
      // Fire when the virtual columns is changed
      // <br />More details parameters refer [here](https://ag-grid.com/vue-data-grid/grid-events/#reference-clientRowModel-virtualColumnsChanged)
      // @arg The grid parameters
      this.$emit('virtual-columns-changed', params)
    },
  },
}
</script>

<style lang="scss">
.wrap-header-text {
  .ag-header-cell-label .ag-header-cell-text {
    white-space: normal !important;
  }
}
</style>
