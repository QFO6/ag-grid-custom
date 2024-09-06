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
        :column-defs="totalColumnDefs"
        :grid-options="totalGridOptions"
        :default-col-def="totalDefaultColDef"
        :row-model-type="rowModelType"
        :server-side-store-type="serverSideStoreType"
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
        @row-data-changed="onRowDataChanged"
        @row-data-updated="onRowDataUpdated"
      />
      <!-- Table append content -->
      <slot name="body.append" />
    </div>
    <base-no-data-placeholder
      v-else
      :message="noRowsText"
    />
  </div>
</template>

<script>
import gridMixin from 'lib/mixins/gridMixin'
import { mapToSsrmParams } from 'lib/utils'

// `VServerPaginatedAgTable` implements the ag-grid [Server-Side Rendering Model (SSRM)](https://ag-grid.com/vue-data-grid/server-side-model/) with server-side pagination enabled by default.
export default {
  name: 'VServerPaginatedAgTable',
  mixins: [gridMixin],
  props: {
    // Table height in [length units](https://www.w3schools.com/cssref/css_units.asp) or % | 1. If using `%` for your height, then make sure the container you are putting the grid into also has height specified;
    // <br />if the parent has no height, then this `%` will always be zero.<br />2. To allow the grid to auto-size it's height to fit rows, you may set grid property `domLayout: 'autoHeight'`, which is 'normal' by default.
    // <br />**Note**: if set `domLayout: 'autoHeight'`, then the explicit `height` won't apply. <br />See [Grid Auto Height](https://www.ag-grid.com/javascript-data-grid/grid-size/#grid-auto-height)
    height: {
      type: String,
      default: '100%',
    },
    // Either '[partial](https://www.ag-grid.com/javascript-data-grid/server-side-model-row-stores/#example-partial-store)' (equivalent to the old server-side row model) or '[full](https://www.ag-grid.com/javascript-data-grid/server-side-model-row-stores/#example-full-store)' (new behavior in v25)
    // <br />as described in the [documentation](https://www.ag-grid.com/javascript-data-grid/server-side-model-row-stores/)
    // <br />Read more:
    // <br />[Upgrading to ag-grid v25 server-side row model](https://blog.ag-grid.com/upgrading-to-ag-grid-v25-server-side-row-model/)
    serverSideStoreType: {
      type: String,
      default: 'partial',
    },
  },
  data() {
    return {
      ssrmParams: null,
      rowModelType: null,
      totalColumnDefs: null,
      totalDefaultColDef: {
        filter: 'agTextColumnFilter',
        sortable: true,
        resizable: true,
      },
      totalGridOptions: {
        pagination: true,
        paginationPageSize: 10,
        cacheBlockSize: 10,
        suppressMultiSort: true,
        domLayout: 'autoHeight',
        animateRows: true,
        // blockLoadDebounceMillis: 100,
        suppressDragLeaveHidesColumns: true,
      },
    }
  },
  created() {
    this.rowModelType = 'serverSide'
    this.id = `server-paged-table-${new Date().getTime()}`

    this.getGridOptions()
    this.getDefaultColDef()

    this.totalColumnDefs = this.columnDefs
      ? this.columnDefs.map((colDef) => {
          colDef.hide = (this.hiddenCols && this.hiddenCols.includes(colDef.field)) || colDef.hide
          if (colDef.hide) {
            return {
              ...colDef,
              suppressFiltersToolPanel: true,
              suppressColumnsToolPanel: true,
            }
          }
          return colDef
        })
      : []
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
      const sortModel = params.api.getSortModel()
      const filterModel = params.api.getFilterModel()
      this.ssrmParams = mapToSsrmParams({ sortModel, filterModel })
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
  },
}
</script>
