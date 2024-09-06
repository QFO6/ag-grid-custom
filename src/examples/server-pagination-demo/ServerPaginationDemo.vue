<template>
  <div>
    <v-card
      elevation-0
      height="100vh"
    >
      <v-card-title>{{ title }}</v-card-title>
      <v-divider />
      <v-card-text>
        <v-server-paginated-ag-table
          :column-defs="columnDefs"
          :hidden-cols="hiddenCols"
          :grid-options="gridOptions"
          :toolbar-options="toolbarOptions"
          :no-rows-text="noRowsText"
          :default-col-def="defaultColDef"
          @grid-ready="onGridReady"
          @viewport-changed="onViewportChanged"
          @row-selection-changed="onRowSelectionChanged"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { TABLE_CONFIG } from './config'
import { mapToSsrmParams } from 'lib/utils'
import VServerPaginatedAgTable from 'lib/tables/VServerPaginatedAgTable'

const tableConfig = cloneDeep(TABLE_CONFIG)

export default {
  name: 'ServerPaginationDemo',
  components: {
    VServerPaginatedAgTable,
  },
  data() {
    return {
      ...tableConfig,
    }
  },
  computed: {
    title() {
      return 'Demo -> ' + this.$route.meta.title
    },
  },
  methods: {
    onGridReady(params) {
      const datasource = this.getServerSideDataSource()
      params.api.setServerSideDatasource(datasource)
    },
    getServerSideDataSource() {
      return {
        getRows: async (params) => {
          try {
            // e.g.: with paginationPageSize=10, initial request startRow=0, endRow=10
            // e.g.: params.request.sortModel=[{colId: "field", sort: "asc" | "desc"}]
            const response = await this.getData(params.request)

            /* old way before v25 */
            // params.successCallback(response.rows, response.rowCount)
            /* new way in v25 */
            params.success({
              rowData: response.rowData,
              rowCount: response.rowCount, // total number of rows
            })
          } catch (e) {
            // eslint-disable-next-line
            console.error(e)
            /* old way before v25 */
            // params.failCallback()
            /* new way in v25 */
            params.fail()
          }
        },
      }
    },
    getData(request) {
      return new Promise((resolve, reject) => {
        if (!request) {
          reject('Invalid request')
          return
        }

        const ssrmParams = mapToSsrmParams(request)
        // eslint-disable-next-line
        console.log(ssrmParams)

        const start = request.startRow
        const limit = request.endRow - request.startRow

        fetch(`https://jsonplaceholder.typicode.com/comments?_start=${start}&_limit=${limit}`)
          .then((res) => res.json())
          .then((rowData) => {
            resolve({ rowData, rowCount: 200 })
          })
          .catch((e) => {
            // eslint-disable-next-line
            console.error(e)
            reject(`Failed to fetch data`)
          })
      })
    },
    onViewportChanged(params) {
      // eslint-disable-next-line
      console.log('onViewPortChanged, params: ', params)
    },
    onRowSelectionChanged(rows) {
      // eslint-disable-next-line
      console.log('Selected rows changed to: ', rows)
    },
  },
}
</script>
