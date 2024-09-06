<template>
  <div>
    <v-card
      elevation-0
      height="100vh"
    >
      <v-card-title>{{ title }}</v-card-title>
      <v-divider />
      <v-card-text>
        <!-- <v-row
          class="mb-2"
          justify="end"
        >
          <v-col cols="auto">
            <v-btn @click="exportDataAsExcel">
              Export to Excel
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="exportDataAsCsv">
              Export to CSV
            </v-btn>
          </v-col>
        </v-row> -->
        <v-client-paginated-ag-table
          :row-data="rowData"
          :column-defs="columnDefs"
          :grid-options="gridOptions"
          :default-col-def="defaultColDef"
          :hidden-cols="hiddenCols"
          :cell-renderers="cellRenderers"
          :toolbar-options="toolbarOptions"
          :auto-group-column-def="autoGroupColumnDef"
          :auto-size-all-columns="autoSizeAllColumns"
          :size-columns-to-fit="sizeColumnsToFit"
          :pin-top-row="pinTopRow"
          :pin-bottom-row="pinBottomRow"
          :csv-export-params="exportParams"
          :excel-export-params="exportParams"
          :no-rows-text="noRowsText"
          :no-rows-message="noRowsMessage"
          :hide-when-no-data="hideWhenNoData"
          @grid-ready="onGridReady"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import VClientPaginatedAgTable from 'lib/tables/VClientPaginatedAgTable'

export default {
  name: 'RowGroupDemo',
  components: {
    VClientPaginatedAgTable,
  },
  data() {
    return {
      gridApi: null,
      columnDefs: null,
      rowData: null,
      defaultColDef: {
        sortable: false,
        filter: false,
        suppressMenu: true,
      },
      hiddenCols: ['make'],
      cellRenderers: [
        {
          field: 'model',
          cellRenderer: 'LinkCellRenderer',
          // cellRendererFramework: 'LinkCellRenderer',
          cellRendererParams: () => {
            return {
              href: 'https://www.honda.com/',
              color: 'blue',
              tooltip: 'View details',
            }
          },
        },
      ],
      autoGroupColumnDef: {
        headerName: 'My Group',
        // width: 120,
        // wrapText: true,
        // autoHeight: true,
        cellRenderer: 'agGroupCellRenderer',
      },
      gridOptions: {
        groupDefaultExpanded: -1,
        // skip header when use autoSizeAllColumns
        skipHeaderOnAutoSize: true,
      },
      toolbarOptions: {
        searchable: true,
        pageSizeResizable: true, // just for demo
      },
      exportParams: {
        allColumns: true,
        skipRowGroups: true,
        fileName: 'test file',
      },
      pinTopRow: true,
      pinBottomRow: true,
      autoSizeAllColumns: true,
      sizeColumnsToFit: false,
      noRowsText: 'No Records',
      noRowsMessage: `
      Amet et kasd ea gubergren accusam consetetur ipsum eirmod, sea ipsum sit voluptua duo nonumy lorem vero takimata voluptua. Ea elitr sit rebum et vero sit stet kasd ipsum. Dolores ut sit stet takimata aliquyam lorem, clita stet diam est.
      `,
      hideWhenNoData: true,
    }
  },
  computed: {
    title() {
      return 'Demo -> ' + this.$route.meta.title
    },
  },
  beforeMount() {
    this.columnDefs = [
      {
        field: 'make',
        rowGroup: true,
        // hide: true
      },
      {
        field: 'model',
        headerName: 'model_Vero elitr dolor labore rebum gubergren et labore. Gubergren aliquyam.',
        width: 200,
        suppressSizeToFit: true,
        wrapText: true,
        autoHeight: true,
      },
      { field: 'price', headerName: 'Market Price' },
      {
        headerName: 'Actions',
        field: 'actions',
        pinned: 'right',
        width: 100,
        suppressSizeToFit: true,
        cellRenderer: 'ActionsCellRenderer',
        cellRendererParams: {
          actions: ['edit', 'delete', 'view'],
        },
      },
    ]

    fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then((result) => result.json())
      .then((rowData) => {
        this.rowData = []
        console.log(rowData)
        // this.rowData = rowData
        // this.rowData[0]['model'] =
          // 'Kasd at et diam justo aliquyam gubergren aliquyam aliquyam takimata sanctus. No nonumy sea erat dolor lorem takimata, dolor magna.'
      })
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api
    },
    exportDataAsExcel() {
      this.gridApi.exportDataAsExcel()
    },
    exportDataAsCsv() {
      this.gridApi.exportDataAsCsv()
    },
  },
}
</script>
