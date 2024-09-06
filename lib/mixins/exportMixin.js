import { processCellCallback } from 'lib/grid-callbacks'

const exportMixin = {
  data() {
    return {
      defaultExportParams: {
        sheetName: 'Sheet1',
        allColumns: true,
        skipRowGroups: true,
        skipColumnGroupHeaders: true,
      },
    }
  },
  props: {
    csvExportParams: {
      type: Object,
      default: function () {
        return {}
      },
    },
    excelExportParams: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  computed: {
    defaultCsvExportParams() {
      return {
        processCellCallback,
        ...this.defaultExportParams,
        ...this.csvExportParams,
      }
    },
    defaultExcelExportParams() {
      return {
        processCellCallback,
        ...this.defaultExportParams,
        ...this.excelExportParams,
      }
    },
  },
  methods: {
    // exportAsCsv() {
    //   try {
    //     if (!this.gridApi) {
    //       throw new Error('gridApi is not defined')
    //     }
    //     const params = {
    //       ...this.exportParams,
    //       ...this.csvExportParams,
    //     }
    //     this.gridApi.exportDataAsCsv({
    //       ...params,
    //       processCellCallback,
    //     })
    //   } catch (e) {
    //     throw new Error(`Failed to export CSV file: ${e.message}`)
    //   }
    // },
    // exportAsExcel() {
    //   const context = this
    //   try {
    //     if (!context.gridApi) {
    //       throw new Error('gridApi is not defined')
    //     }
    //     const params = {
    //       ...this.exportParams,
    //       ...this.excelExportParams,
    //     }
    //     context.gridApi.exportDataAsExcel({
    //       ...params,
    //       processCellCallback,
    //     })
    //   } catch (e) {
    //     throw new Error(`Failed to export Excel file: ${e.message}`)
    //   }
    // },
  },
}

export default exportMixin
