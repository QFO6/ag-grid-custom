import { AgGridVue } from 'ag-grid-vue'
import { findColumnProp } from 'lib/utils/index'
import { AG_DEFAULT_DATE_FILTER_PARAMS, AG_DEFAULT_DATE_COMPARATOR } from 'lib/utils/constants'
import { isEmpty, has, includes, cloneDeep } from 'lodash'

import 'ag-grid-community/dist/styles/ag-grid.min.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.min.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.min.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.min.css'
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.min.css'
import 'ag-grid-community/dist/styles/ag-theme-material.min.css'

import AgTableToolbar from 'lib/controls/AgTableToolbar'
import LinkCellRenderer from 'lib/cell-renders/LinkCellRenderer'
import RankCellRenderer from 'lib/cell-renders/RankCellRenderer'
import TooltipCellRenderer from 'lib/cell-renders/TooltipCellRenderer'
import ShowMoreCellRenderer from 'lib/cell-renders/ShowMoreCellRenderer'
import ActionsCellRenderer from 'lib/cell-renders/actions-cell-renderer/Index'
import CountryCellRenderer from 'lib/cell-renders/CountryCellRenderer'
import ProgressCellRenderer from 'lib/cell-renders/ProgressCellRenderer'
import MultiLinkCellRenderer from 'lib/cell-renders/MultiLinkCellRenderer'
import PinnedRowCellRenderer from 'lib/cell-renders/PinnedRowCellRenderer'
import MultiParagraphCellRenderer from 'lib/cell-renders/MultiParagraphCellRenderer'
import NumericCellEditor from 'lib/cell-editors/NumericCellEditor'
import BaseNoDataPlaceholder from 'lib/common/BaseNoDataPlaceholder'

import * as suppress from 'lib/utils/suppress-keys'

const gridMixin = {
  components: {
    AgGridVue,
    AgTableToolbar,
    LinkCellRenderer,
    RankCellRenderer,
    TooltipCellRenderer,
    ShowMoreCellRenderer,
    ActionsCellRenderer,
    CountryCellRenderer,
    ProgressCellRenderer,
    MultiLinkCellRenderer,
    PinnedRowCellRenderer,
    MultiParagraphCellRenderer,
    NumericCellEditor,
    BaseNoDataPlaceholder,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    // Provided [ag-grid themes](https://www.ag-grid.com/javascript-data-grid/themes-provided/):
    // <br />`ag-theme-balham`, `ag-theme-balham-dark`, `ag-theme-alpine`, `ag-theme-alpine-dark`, `ag-theme-material`
    theme: {
      type: String,
      default: 'ag-theme-balham',
    },
    // Table width in [length units](https://www.w3schools.com/cssref/css_units.asp) or %
    width: {
      type: String,
      default: '100%',
    },
    // The max height of the table
    maxHeight: {
      type: String,
      default: '100%',
    },
    // See [editType](https://www.ag-grid.com/vue-data-grid/grid-options/#reference-editing-editType)
    // Set to 'fullRow' to enable Full Row Editing. Otherwise leave blank to edit one cell at a time.
    editType: {
      type: String,
      default: '',
    },
    // The exporter dialog sub titles
    datasetName: {
      type: String,
      default: '',
    },
    // See [Grid Properties](https://www.ag-grid.com/vue-data-grid/grid-properties/)
    // <br />1. Be sure to keep [cacheBlockSize](https://www.ag-grid.com/vue-data-grid/grid-properties/#reference-infiniteRowModel-cacheBlockSize) equal to [paginationPageSize](https://www.ag-grid.com/vue-data-grid/grid-properties/#reference-pagination-paginationPageSize).
    // <br />2. For SSRM (Server-side Row Model), `suppressMultiSort` is set to `true` by default to suppress sorting multiple columns at one time.
    // <br />It can be set to `false` if the backend server allows.
    gridOptions: {
      type: Object,
      default: function () {
        return {}
      },
    },
    // See [Column Properties](https://www.ag-grid.com/vue-data-grid/column-properties/)
    // <br />1. Hidden columns (`hide: true`) will not appear in the Columns/Filters Tool Panel.
    columnDefs: {
      type: Array,
      required: true,
    },
    // List of hidden columns, using the '[field](https://www.ag-grid.com/vue-data-grid/column-properties/#reference-columns-field)' name in the columnDefs.
    // **Note** that this is not an ag-grid built-in property.
    // <br />There are two ways to define hidden columns:
    // <br />1. Set `hide: true` in `columnDefs` for the columns to be hidden
    // <br />2. Define `hiddenCols`
    hiddenCols: {
      type: Array,
      default: function () {
        return []
      },
    },
    // List of column filters
    // <br />More details please refer [here](https://www.ag-grid.com/vue-data-grid/filtering/)
    filters: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'field') || !has(element, 'filter')) {
            return false
          }
        }
        return true
      },
    },
    // List of aggFunc
    // <br />More details please refer [here](https://www.ag-grid.com/javascript-data-grid/aggregation-custom-functions/)
    aggFuncs: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'field') || !has(element, 'aggFunc')) {
            return false
          }
        }
        return true
      },
    },
    // Customized cell Renderer components for this column's cells.
    // <br />Please provide array of the components name, E.g. ['LinkCellRender', 'ActionsCellRender']
    // <br />More details please refer [here](https://ag-grid.com/vue-data-grid/cell-rendering/)
    cellRenderers: {
      type: Array,
      default: function () {
        return []
      },
    },
    // cellStyles of the given fields or fields that match the regular expression
    // <br />Each item is an object of css values / or function returning an object of css values for a particular cell.
    // <br />E.g. {color: 'red', 'background-color': 'green'}
    // <br />More details please refer [here](https://ag-grid.com/vue-data-grid/column-properties/#reference-styling-cellStyle)
    cellStyles: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'field') || !has(element, 'cellStyle')) {
            return false
          }
        }
        return true
      },
    },
    cellEditors: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'field') || !has(element, 'cellEditor')) {
            return false
          }
        }
        return true
      },
    },
    // valueFormatters of the given fields or fields that match the regular expression
    valueFormatters: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'field') || !has(element, 'valueFormatter')) {
            return false
          }
        }
        return true
      },
    },
    // valueGetters of the given fields or fields that match the regular expression
    valueGetters: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'field') || !has(element, 'valueGetter')) {
            return false
          }
        }
        return true
      },
    },
    // valueSetters of the given fields or fields that match the regular expression
    valueSetters: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'field') || !has(element, 'valueSetter')) {
            return false
          }
        }
        return true
      },
    },
    // valueParsers of the given fields or fields that match the regular expression
    valueParsers: {
      type: Array,
      default: function () {
        return []
      },
      validator: function (value) {
        for (const element of value) {
          if (!has(element, 'field') || !has(element, 'valueParser')) {
            return false
          }
        }
        return true
      },
    },
    // Specify the column attribute for each column, attribute can be any of defined in [here](https://ag-grid.com/vue-data-grid/column-properties/)
    // <br />E.g.
    // <br />{
    // <br />&nbsp;&nbsp;ID: {
    // <br />&nbsp;&nbsp;&nbsp;&nbsp;flex: 1,
    // <br />&nbsp;&nbsp;},
    // <br />&nbsp;&nbsp;CreatedAt: {
    // <br />&nbsp;&nbsp;&nbsp;&nbsp;flex: 1,
    // <br />&nbsp;&nbsp;},
    // <br />&nbsp;&nbsp;valueFormatter: function(params) {
    // <br />&nbsp;&nbsp;&nbsp;&nbsp;return timeFormatter(params.value)
    // <br />&nbsp;&nbsp;},
    // <br />}
    columnAttrs: {
      type: Object,
      default: function () {
        return {}
      },
    },
    // Options available:
    // <br />{ enableSearch: true \|false, resettable: true \|false, enablePageSizeSelection: true \|false, targetFsSelector: 'table-id' }
    toolbarOptions: {
      type: Object,
      default: function () {
        return {}
      },
    },
    // `defaultColDef` is the column definition that applies to all the columns.
    // <br />See [Default Column Definition](https://www.ag-grid.com/javascript-data-grid/column-definitions/#default-column-definitions)
    // <br />1. [Auto Row Height](https://www.ag-grid.com/javascript-data-grid/row-height/#auto-row-height) is enabled by default by setting both `wrapText=true` and `autoHeight=true`. And the height of the largest column is used.
    // <br />2. `text` filter is enabled on each column by default. It can be overwrote by specifying a filter on a column via the `columnDefs`. The `filter` could either be a `string` or `Component`. E.g.: The **Year** column has a `'number'` filter could be defined either using `filter: 'agNumberColumnFilter'` or `filter: 'number'`. To disable filtering for a specific column, simply set `filter: false`
    // <br />**Note:**
    // <br />(1) Set `filter: true` won't enable the default `text` filter when Partial Store is used (i.e. `serverSideStoreType='partial'`).
    // <br />(2) Only the columns with `filter` enabled will appear in the [Filters Tool Panel](https://www.ag-grid.com/vue-data-grid/tool-panel-filters/).
    // <br />Read more:
    // <br />- [Partial Store Filtering](https://www.ag-grid.com/vue-data-grid/server-side-model-filtering/#partial-store-filtering)
    // <br />- [Configuring Filters on Columns](https://www.ag-grid.com/vue-data-grid/filtering/#configuring-filters-on-columns)
    defaultColDef: {
      type: Object,
      default: function () {
        return {}
      },
    },
    // The side bar is by default displayed with the columns and filters tool panels.
    sideBar: {
      type: [Boolean, String, Object],
      default: function () {
        return {
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
              toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true,
              },
            },
            {
              id: 'filters',
              labelDefault: 'Filters',
              labelKey: 'filters',
              iconKey: 'filter',
              toolPanel: 'agFiltersToolPanel',
            },
          ],
        }
      },
    },
    pinnedTopRowData: {
      type: Array,
      default: function () {
        return []
      },
    },
    pinnedBottomRowData: {
      type: Array,
      default: function () {
        return []
      },
    },
    // The text to show when there is no row data
    // <br />TODO: fixed no rows overlay doesn't work on SSRM
    noRowsText: {
      type: String,
      default: 'No Data',
    },
    // The message (e.g. a long description) to show when there is no row data
    noRowsMessage: {
      type: String,
      default: '',
    },
    // Hide table when no rows
    hideWhenNoData: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      id: '',
      context: null,
      gridApi: null,
      gridColumnApi: null,
    }
  },
  computed: {
    // Show table if has rows or hideWhenNoData is set to true
    hide() {
      if (Array.isArray(this.rowData) && !this.rowData.length && this.hideWhenNoData) return true
      return false
    },
    gridHeight() {
      if (has(this.totalGridOptions, 'domLayout')) {
        if (this.totalGridOptions['domLayout'] === 'autoHeight') {
          return ''
        }
      }
      return this.height
    },
    formattedToolbarOptions() {
      return {
        ...this.toolbarOptions,
        targetFsSelector: this.id,
      }
    },
    // Overlay template when there is no data
    overlayNoRowsTemplate() {
      return `
        <span class="overlay grey--text text--darken-4 text-capitalize">
          ${this.noRowsText}
        </span>`
    },
  },
  watch: {
    columnDefs: {
      deep: true,
      handler: function () {
        const columnDefs = this.getColumnDefs()
        if (this.gridApi) {
          this.gridApi.setColumnDefs(columnDefs)
        }
      },
    },
  },
  beforeMount() {
    this.context = { componentParent: this }
  },
  methods: {
    getColumnDefs() {
      const context = this

      const deepMergeDefs = function (columnDefs) {
        if (isEmpty(columnDefs)) return []

        return columnDefs.reduce((acc, colDef) => {
          if (has(colDef, 'children')) {
            const children = deepMergeDefs(colDef[['children']])
            acc.push({
              ...colDef,
              children,
            })
          } else {
            // merge with hiddenCols
            if (includes(context.hiddenCols, colDef['field'])) {
              colDef.hide = true
              colDef.suppressFiltersToolPanel = true
              colDef.suppressColumnsToolPanel = true
            }

            // merge with filter
            if (colDef['filter'] === 'agDateColumnFilter') {
              colDef['comparator'] = AG_DEFAULT_DATE_COMPARATOR
              colDef['filterParams'] = AG_DEFAULT_DATE_FILTER_PARAMS
            }
            let filter = findColumnProp(context.filters, colDef['field'])
            if (filter) {
              colDef = { ...filter, ...colDef }
            }

            // merge with aggFuncs
            let aggFunc = findColumnProp(context.aggFuncs, colDef['field'])
            if (aggFunc) {
              colDef = { ...aggFunc, ...colDef }
            }

            // merge with cellStyle
            let cellStyle = findColumnProp(context.cellStyles, colDef['field'])
            if (cellStyle) {
              colDef = { ...cellStyle, ...colDef }
            }

            // merge with cellEditor
            const cellEditor = findColumnProp(context.cellEditors, colDef['field'])
            if (cellEditor) {
              colDef = { ...cellEditor, ...colDef }
            }

            // merge with cellRenderers
            const cellRenderer = findColumnProp(context.cellRenderers, colDef['field'])
            if (cellRenderer) {
              colDef = { ...cellRenderer, ...colDef }
            }

            // merge with valueFormatter
            const valueFormatter = findColumnProp(context.valueFormatters, colDef['field'])
            if (valueFormatter) {
              colDef = { ...valueFormatter, ...colDef }
            }

            // merge with valueGetter
            const valueGetter = findColumnProp(context.valueGetters, colDef['field'])
            if (valueGetter) {
              colDef = { ...valueGetter, ...colDef }
            }

            // merge with valueSetter
            const valueSetter = findColumnProp(context.valueSetters, colDef['field'])
            if (valueSetter) {
              colDef = { ...valueSetter, ...colDef }
            }

            // merge with valueParser
            const valueParser = findColumnProp(context.valueParsers, colDef['field'])
            if (valueParser) {
              colDef = { ...valueParser, ...colDef }
            }

            acc.push(colDef)
          }
          return acc
        }, [])
      }

      const columnDefs = cloneDeep(this.columnDefs)
      return deepMergeDefs(columnDefs)
    },
    // Returns gridOptions by merging the default options and custom options
    getGridOptions() {
      Object.assign(this.totalGridOptions, this.gridOptions)

      // For full row editing, prevent both single-click and double-click from starting the edit
      if (this.editType === 'fullRow' || this.totalGridOptions.editType === 'fullRow') {
        Object.assign(this.totalGridOptions, {
          suppressClickEdit: true,
          // suppressRowClickSelection: true,
        })
      }
    },
    // Returns defaultColDef
    getDefaultColDef() {
      Object.assign(this.totalDefaultColDef, this.defaultColDef)

      // For full row editing, suppress the following keyboard events
      if (this.editType === 'fullRow' || this.totalGridOptions.editType === 'fullRow') {
        Object.assign(this.totalDefaultColDef, {
          suppressKeyboardEvent: (params) => {
            return suppress.suppressEnter(params) || suppress.suppressNavigation(params)
          },
        })
      }
    },
    // Sets columns to adjust in size to fit the grid horizontally
    sizeToFit() {
      if (this.gridApi) {
        this.gridApi.sizeColumnsToFit()
      }
    },
    /**
     * Resizes all columns to fit the contents of the cells and the headers.
     * If you do not want the headers to be included in the autosize calculation, set the grid property skipHeaderOnAutoSize=true or pass in skipHeader=true.
     * @param {*} skipHeader
     */
    autoSizeAll(params, skipHeader) {
      // skip the columns with colDef.suppressSizeToFit set to true
      const allColumnIds = params.columnApi.getAllColumns().reduce((acc, column) => {
        if (!column.colDef.suppressSizeToFit) {
          acc.push(column.colId)
        }
        return acc
      }, [])
      params.columnApi.autoSizeColumns(allColumnIds, skipHeader)
    },
    // Returns the first editable colKey
    getFirstEditableColumn() {
      if (!this.gridColumnApi) return ''

      const columns = this.gridColumnApi.getAllDisplayedColumns()
      for (const column of columns) {
        const colDef = column.colDef
        if (colDef.editable) {
          return column.colId
        }
      }
      return ''
    },
    // Freezes the first visible column
    setFirstColPinned() {
      const displayedColumns = this.gridColumnApi.getAllDisplayedColumns()
      if (displayedColumns.length > 0) {
        const firstColId = displayedColumns[0].colId
        this.gridColumnApi.setColumnPinned(firstColId, 'left')
      }
    },
    // Freezes the last visible column
    setLastColPinned() {
      const displayedColumns = this.gridColumnApi.getAllDisplayedColumns()
      if (displayedColumns.length > 0) {
        const firstColId = displayedColumns[displayedColumns.length - 1].colId
        this.gridColumnApi.setColumnPinned(firstColId, 'right')
      }
    },
    // Freezes the top row
    setTopRowPinned() {
      const firstRow = this.rowData.shift()
      this.gridApi.setPinnedTopRowData(new Array(firstRow))
      this.gridApi.setRowData(this.rowData)
    },
    // Freezes the bottom row
    setBottomRowPinned() {
      if (!isEmpty(this.rowData)) {
        const lastRow = this.rowData.pop()
        this.gridApi.setPinnedBottomRowData(new Array(lastRow))
        this.gridApi.setRowData(this.rowData)
      }
    },
    onCellValueChanged(params) {
      this.$emit('cell-value-changed', params)
    },
    onRowEditingStarted(params) {
      // refresh the action cellRenderer in the editing row
      params.api.refreshCells({
        columns: ['action'],
        // rowNodes: [params.node],
        force: true,
      })
      this.$emit('row-editing-started', params)
    },
    onRowEditingStopped(params) {
      // refresh the action cellRenderer in the editing row
      params.api.refreshCells({
        columns: ['action'],
        // rowNodes: [params.node],
        force: true,
      })
      this.$emit('row-editing-stopped', params)
    },
    onRowValueChanged(params) {
      this.$emit('row-value-changed', params)
    },
    // @vuese
    // Handle the ag grid reset clicked event and fire to parent component
    onResetAgTableClicked() {
      // Fire when the reset button clicked is changed
      this.$emit('grid-refresh-request')
    },
  },
}

export default gridMixin
