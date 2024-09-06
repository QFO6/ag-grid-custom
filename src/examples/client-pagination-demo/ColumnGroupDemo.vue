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
          :side-bar="sideBar"
          :row-data="rowData"
          :column-defs="columnDefs"
          :grid-options="gridOptions"
          :toolbar-options="toolbarOptions"
          :default-col-def="defaultColDef"
          :csv-export-params="exportParams"
          :excel-export-params="exportParams"
          @grid-ready="onGridReady"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import VClientPaginatedAgTable from 'lib/tables/VClientPaginatedAgTable'

export default {
  name: 'ColumnGroupDemo',
  components: {
    VClientPaginatedAgTable,
  },
  data() {
    return {
      columnDefs: null,
      rowData: null,
      gridApi: null,
      sideBar: false,
      defaultColDef: {
        sortable: false,
        filter: false,
        suppressMenu: true,
      },
      gridOptions: {},
      toolbarOptions: {
        searchable: true,
        pageSizeResizable: true, // just for demo
      },
      exportParams: {
        allColumns: true,
        fileName: 'test file',
      },
    }
  },
  computed: {
    title() {
      return 'Demo -> ' + this.$route.meta.title
    },
  },
  beforeMount() {
    ;(this.columnDefs = [
      {
        headerName: 'Athlete Details',
        children: [
          { headerName: 'Athlete', field: 'athlete' },
          { headerName: 'Age', field: 'age' },
          { headerName: 'Country', field: 'country' },
        ],
      },
      {
        headerName: 'Sports Results',
        children: [
          {
            headerName:
              'SportTempor lorem est et tempor amet tempor justo dolore sanctus at, vero nonumy no sea sit duo voluptua dolore sit.',
            field: 'sport',
            headerTooltip:
              'SportTempor lorem est et tempor amet tempor justo dolore sanctus at, vero nonumy no sea sit duo voluptua dolore sit.',
          },
          {
            headerName: 'Total',
            field: 'total',
          },
          {
            headerName: 'Gold',
            field: 'gold',
          },
          {
            headerName: 'Silver',
            field: 'silver',
          },
          {
            headerName: 'Bronze',
            field: 'bronze',
          },
        ],
      },
    ]),
      fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((result) => result.json())
        .then((rowData) => (this.rowData = rowData))
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
