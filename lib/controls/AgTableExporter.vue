<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="500px"
    >
      <template #activator="{ on: dialogOn, attrs: dialogAttrs }">
        <v-btn
          v-if="showText"
          outlined
          :color="color"
          v-bind="dialogAttrs"
          :x-small="xSmall"
          :small="small"
          :large="large"
          :x-large="xLarge"
          class="text-capitalize"
          v-on="{ ...dialogOn }"
        >
          <div>
            <v-icon
              left
              small
            >
              {{ icon }}
            </v-icon>
            {{ label }}
          </div>
        </v-btn>
        <v-tooltip
          v-else
          top
        >
          <template #activator="{ on: tooltipOn }">
            <v-btn
              icon
              :color="color"
              v-bind="dialogAttrs"
              :x-small="xSmall"
              :small="small"
              :large="large"
              :x-large="xLarge"
              class="text-capitalize"
              @click="onExportIconClicked"
              v-on="{ ...dialogOn, ...tooltipOn }"
            >
              <v-icon size="22">
                {{ icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ label }}</span>
        </v-tooltip>
      </template>
      <v-card :loading="loading">
        <v-app-bar
          dark
          dense
          color="primary"
          class="form-header px-2"
        >
          {{ dialogTitle }}
          <v-spacer />
          <v-btn
            icon
            small
            style="margin-right: -6px"
            @click="dialog = false"
          >
            <v-icon small>
              mdi-close
            </v-icon>
          </v-btn>
        </v-app-bar>
        <v-divider />
        <v-card-text style="height: 400px; padding-bottom: 0px">
          <div>
            <v-row
              v-if="alert"
              no-gutter
              justify="center"
            >
              <v-col
                cols="12"
                class="py-0"
              >
                <v-alert
                  class="mb-0 font-weight-medium"
                  text
                  dense
                  dismissible
                  :icon="alert.type === 'warning' ? 'mdi-alert' : ''"
                  :type="alert.type"
                  transition="fade-transition"
                  @input="onAlertChanged"
                >
                  {{ alert.message }}
                </v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <p style="margin-top: 20px">
                  Target Columns:
                </p>
              </v-col>
              <v-col
                cols="12"
                sm="8"
              >
                <v-radio-group
                  v-model="targetTableCols"
                  :mandatory="true"
                >
                  <v-radio
                    v-if="targetColsAllVisible"
                    label="All columns"
                    value="all"
                    :disabled="targetColsAllDisabled"
                  />
                  <v-radio
                    v-if="targetColsSelectedVisible"
                    label="Displayed columns"
                    :disabled="targetColsSelectedDisabled"
                    value="displayed"
                  />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <p style="margin-top: 20px">
                  {{ targetTypeLabel }}:
                </p>
              </v-col>
              <v-col
                cols="12"
                sm="8"
              >
                <v-radio-group
                  v-model="targetTableRows"
                  :mandatory="true"
                >
                  <v-radio
                    v-if="targetRowsAllVisible"
                    :label="allDataRadioName"
                    value="all"
                    :disabled="targetRowsAllDisabled"
                  />
                  <v-radio
                    v-if="targetRowsSelectedVisible"
                    :label="selectedDataRadioName"
                    :disabled="targetRowsSelectedDisabled"
                    value="selected"
                  />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <p style="margin-top: 20px">
                  Format:
                </p>
              </v-col>
              <v-col
                cols="12"
                sm="8"
              >
                <v-radio-group
                  v-model="format"
                  :mandatory="true"
                >
                  <v-radio
                    v-if="excel"
                    label="Excel"
                    value="xlsx"
                  />
                  <v-radio
                    v-if="csv"
                    label="CSV"
                    value="csv"
                  />
                </v-radio-group>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            rounded
            outlined
            color="primary"
            @click="onExportBtnClicked"
          >
            Export
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { has } from 'lodash'
import * as Papa from 'papaparse'
import { processCellCallback } from 'lib/grid-callbacks'
import { capitalize, downloadExcel, downloadCsv, isEmptyArray } from 'lib/utils'

export default {
  name: 'AgTableExporter',
  components: {},
  mixins: [],
  props: {
    gridOptions: {
      type: Object,
      required: true,
    },
    datasetName: {
      type: String,
      default: 'rows',
    },
    icon: {
      type: String,
      default: 'mdi-download-outline',
    },
    label: {
      type: String,
      default: 'Export',
    },
    color: {
      type: String,
      default: '',
    },
    dialogTitle: {
      type: String,
      default: 'Export Table Data',
    },
    fileName: {
      type: String,
      default: 'export',
    },
    showText: {
      type: Boolean,
      default: false,
    },
    targetColsDefault: {
      type: String,
    },
    targetRowsDefault: {
      type: String,
    },
    targetColsAllVisible: {
      type: Boolean,
      default: true,
    },
    targetColsAllDisabled: {
      type: Boolean,
      default: false,
    },
    targetColsSelectedVisible: {
      type: Boolean,
      default: true,
    },
    targetColsSelectedDisabled: {
      type: Boolean,
      default: false,
    },
    targetRowsAllVisible: {
      type: Boolean,
      default: true,
    },
    targetRowsAllDisabled: {
      type: Boolean,
      default: false,
    },
    targetRowsSelectedVisible: {
      type: Boolean,
      default: true,
    },
    targetRowsSelectedDisabled: {
      type: Boolean,
      default: false,
    },
    csv: {
      type: Boolean,
      default: true,
    },
    excel: {
      type: Boolean,
      default: true,
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
    xLarge: {
      type: Boolean,
      default: false,
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
    /**
     * only for exporting excel, the additional sheets
     * The sheet data should be a two-dimensional array fex.
     * [{
     *   sheetName: 'sheet1',
     *   sheetData: [['11', '12'], ['21', '22']]
     * }]
     */
    addExcelData: {
      type: Array,
      validator: function (value) {
        for (let i = 0; i < value.length; i++) {
          if (!has(value[i], 'sheetData')) return false
        }
        return true
      },
    },
  },
  data() {
    return {
      alert: null,
      dialog: false,
      loading: false,
      format: 'xlsx',
      targetTableCols: 'all', // 'displayed'
      targetTableRows: 'all',
    }
  },
  computed: {
    gridApi() {
      if (this.gridOptions && this.gridOptions.api) {
        return this.gridOptions.api
      }
      return null
    },
    columnApi() {
      if (this.gridOptions && this.gridOptions.columnApi) {
        return this.gridOptions.columnApi
      }
      return null
    },
    storedFileName() {
      return `${this.fileName}.${this.format}`
    },
    targetTypeLabel() {
      return `Target ${capitalize(this.datasetName)}`
    },
    allDataRadioName() {
      return `All ${this.datasetName.toLowerCase()}`
    },
    selectedDataRadioName() {
      return `Selected ${this.datasetName.toLowerCase()}`
    },
  },
  created() {
    if (this.targetColsDefault) {
      this.targetTableCols = this.targetColsDefault
    }
    if (this.targetRowsDefault) {
      this.targetTableRows = this.targetRowsDefault
    }
  },
  methods: {
    onExportIconClicked() {},
    onExportBtnClicked() {
      const params = {
        fileName: this.storedFileName,
        columnGroups: true,
      }
      this.loading = true
      if (this.targetTableCols === 'all') {
        params['allColumns'] = true
      } else {
        params['allColumns'] = false
      }
      if (this.targetTableRows === 'selected') {
        params['onlySelectedAllPages'] = true
      }
      if (this.format === 'csv') this.exportAsCsv(params)
      if (this.format === 'xlsx') this.exportAsExcel(params)
    },
    exportAsCsv(params) {
      const context = this
      if (!context.gridApi || !params) {
        context.onFailure(`Export CSV failed with unknown error, please try again later.`)
        return
      }

      try {
        if (
          context.targetTableCols === 'displayed' &&
          context.columnApi.getAllDisplayedColumns().length === 0
        ) {
          context.onFailure(`There is no any columns found.`)
          return
        }

        if (
          context.targetTableRows === 'selected' &&
          context.gridApi.getSelectedRows().length === 0
        ) {
          context.onFailure(`There is no any selected rows.`)
          return
        }

        if (
          context.gridOptions.rowModelType === 'serverSide' &&
          typeof context.allRowDataCbFn === 'function'
        ) {
          if (context.allRowDataCbFnParams) {
            let currentSelectedCols = []
            const currentPageExcelData = context.getTableSheetData(params)

            if (
              context.gridApi.columnController &&
              Array.isArray(context.columnApi.getAllDisplayedColumns())
            ) {
              currentSelectedCols = context.columnApi
                .getAllDisplayedColumns()
                .map((item) => item['colId'])
                .filter((item) => Boolean(item))
            }
            context
              .allRowDataCbFn({
                ...context.allRowDataCbFnParams,
                ...context.ssrmParams, // all of table states fex. sorts/filters/row_groups...
                currentPageExcelData, // used to get the column names in the excel
                colsType: context.targetTableCols, // used to control the selected cols
                currentSelectedCols, // used to control the selected cols
              })
              .then((allExcelData) => {
                if (Array.isArray(allExcelData) && allExcelData.length) {
                  const plainData = allExcelData[0]['sheetData']
                  downloadCsv(plainData, params.fileName)
                    .then(() => {
                      context.loading = false
                    })
                    .catch((err) => {
                      context.onFailure(
                        `Export CSV failed with error: ${err}, please contact with system admin.`
                      )
                    })
                } else {
                  context.onFailure(
                    `Export Excel failed with error: no data found, please contact with system admin.`
                  )
                }
                context.dialog = false
              })
              .catch((err) => {
                context.onFailure(`Export Excel failed with error: ${err}, please try again later.`)
              })
          } else {
            context.onFailure(`Export Excel failed, invalid parameters`)
          }
        } else {
          context.gridApi.exportDataAsCsv({
            ...params,
            processCellCallback,
          })
          context.loading = false
          context.dialog = false
        }
      } catch (e) {
        context.onFailure(`Export CSV failed with error: ${e}, please try again later.`)
      }
    },
    exportAsExcel(params) {
      const context = this
      if (!context.gridApi || !params) {
        context.onFailure(`Export Excel failed with unknown error, please try again later.`)
        return
      }

      try {
        if (
          context.targetTableCols === 'displayed' &&
          context.columnApi.getAllDisplayedColumns().length === 0
        ) {
          context.onFailure(`There is no any columns found.`)
          return
        }

        if (
          context.targetTableRows === 'selected' &&
          context.gridApi.getSelectedRows().length === 0
        ) {
          context.onFailure(`There is no any selected rows.`)
          return
        }

        if (
          context.gridOptions.rowModelType === 'serverSide' &&
          typeof context.allRowDataCbFn === 'function'
        ) {
          if (context.allRowDataCbFnParams) {
            let currentSelectedCols = []
            const currentPageExcelData = this.getTableSheetData(params)

            if (
              context.gridApi.columnController &&
              Array.isArray(context.columnApi.getAllDisplayedColumns())
            ) {
              currentSelectedCols = context.columnApi
                .getAllDisplayedColumns()
                .map((item) => item['colId'])
                .filter((item) => Boolean(item))
            }
            context
              .allRowDataCbFn({
                ...context.allRowDataCbFnParams,
                ...context.ssrmParams, // all of table states fex. sorts/filters/row_groups...
                currentPageExcelData, // used to get the column names in the excel
                colsType: context.targetTableCols, // used to control the selected cols
                currentSelectedCols, // used to control the selected cols
              })
              .then((allExcelData) => {
                if (Array.isArray(allExcelData) && allExcelData.length) {
                  downloadExcel(allExcelData, params.fileName)
                    .then(() => {
                      context.loading = false
                    })
                    .catch((err) => {
                      context.onFailure(
                        `Export excel failed with error: ${err}, please contact with system admin.`
                      )
                    })
                } else {
                  context.onFailure(
                    `Export Excel failed with error: no data found, please contact with system admin.`
                  )
                }
                context.dialog = false
              })
              .catch((err) => {
                context.onFailure(`Export Excel failed with error: ${err}, please try again later.`)
              })
          } else {
            context.onFailure(`Export Excel failed, invalid parameters`)
          }
        } else {
          if (!context.addExcelData || isEmptyArray(context.addExcelData)) {
            context.gridApi.exportDataAsExcel({
              ...params,
              processCellCallback,
            })
            context.loading = false
          } else {
            downloadExcel(context.constructExcelData(params), params.fileName)
              .then(() => {
                context.loading = false
              })
              .catch((err) => {
                context.onFailure(
                  `Export excel failed with error: ${err}, please contact with system admin.`
                )
              })
          }
          context.dialog = false
        }
      } catch (e) {
        context.onFailure(`Export Excel failed with error: ${e}, please try again later.`)
      }
    },
    constructExcelData(params) {
      const excelData = []
      const tableSheetData = this.getTableSheetData(params)
      excelData.push({
        sheetData: tableSheetData,
        sheetName: 'Table Data',
        fitColumn: true,
        rowOpts: [{ hpt: 25 }, { hpt: 40 }, { hpt: 40 }, { hpt: 30 }],
      })

      if (!isEmptyArray(this.addExcelData)) {
        this.addExcelData.forEach((item, index) => {
          excelData.push({
            sheetData: item['sheetData'] || [],
            sheetName: item['sheetName'] || `sheet${index + 1}`,
            fitColumn: true,
          })
        })
      }

      return excelData
    },
    getTableSheetData(params) {
      if (!this.gridOptions || !this.gridOptions.columnDefs) return []

      let csvData = this.gridOptions.api.getDataAsCsv({
        ...params,
        processCellCallback,
      })
      csvData = csvData.replace(/"\r/g, `"<&>`)
      let exportData = csvData.split('<&>')
      for (let i = 0; i < exportData.length; i++) {
        exportData[i] = exportData[i].replace(/(\r|\n)/g, '')
      }
      let excelData = []
      if (exportData.length > 0) {
        for (let v of exportData) {
          let obj = Papa.parse(v)
          excelData.push(obj['data'][0])
        }
      }
      return excelData
    },
    onFailure(message) {
      this.loading = false
      this.alert = { type: 'error', message }
      setTimeout(() => {
        this.alert = null
      }, 3000)
    },
    onAlertChanged(value) {
      if (!value) this.alert = null
    },
  },
}
</script>
