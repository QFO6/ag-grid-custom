<template>
  <div>
    <v-card 
      elevation-0 
      height="100vh"
    >
      <v-card-title>{{ title }}</v-card-title>
      <v-divider />
      <v-card-text>
        <v-client-paginated-ag-table
          :edit-type="editType"
          :row-data="rowData"
          :column-defs="columnDefs"
          :grid-options="gridOptions"
          :default-col-def="defaultColDef"
          :cell-editors="cellEditors"
          :auto-size-all-columns="autoSizeAllColumns"
          :size-columns-to-fit="sizeColumnsToFit"
          @cell-value-changed="onCellValueChanged"
          @row-value-changed="onRowValueChanged"
          @row-update-request="onCustomRowValueChanged"
          @row-delete-request="onRowDeleteRequest"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import VClientPaginatedAgTable from 'lib/tables/VClientPaginatedAgTable'

export default {
  name: 'RowEditDemo',
  components: {
    VClientPaginatedAgTable,
  },
  data() {
    return {
      columnDefs: [
        {
          field: 'make',
          headerName: 'Make',
          editable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['Porsche', 'Toyota', 'Ford', 'AAA', 'BBB', 'CCC'],
          },
        },
        {
          field: 'model',
          headerName: 'Model',
          // editable: true,
          // cellEditor: 'agTextCellEditor',
        },
        {
          field: 'price',
          headerName: 'Price',
          // editable: true,
          // cellEditor: 'NumericCellEditor',
          // cellEditorParams: {
          //   type: 'float',
          //   min: -1,
          //   max: 1,
          //   step: 0.1,
          // },
        },
        {
          headerName: 'Action',
          field: 'action',
          pinned: 'right',
          width: 200,
          suppressSizeToFit: true,
          cellRenderer: 'ActionsCellRenderer',
          cellRendererParams: {
            actions: ['inlineEdit', 'delete', 'view'],
          },
        },
      ],
      rowData: null,
      defaultColDef: {
        sortable: false,
        filter: false,
        suppressMenu: true,
      },
      gridOptions: {
        skipHeaderOnAutoSize: true,
      },
      cellEditors: [
        {
          field: 'price',
          editable: true,
          cellEditor: 'NumericCellEditor',
          cellEditorParams: {
            type: 'float',
            min: -1,
            max: 1,
            step: 0.1,
          },
        },
        {
          field: 'model',
          editable: true,
          cellEditor: 'agTextCellEditor',
        },
      ],
      editType: 'fullRow',
      autoSizeAllColumns: true,
      sizeColumnsToFit: false,
    }
  },
  computed: {
    title() {
      return 'Demo -> ' + this.$route.meta.title
    },
  },
  beforeMount() {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then((result) => result.json())
      .then((rowData) => {
        this.rowData = rowData
      })
  },
  methods: {
    onCellValueChanged(event) {
      // console.log('onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue)
      this.$emit('cell-value-changed', event)
    },
    onRowValueChanged(event) {
      console.log('onRowValueChanged: ', event.data)
      this.$emit('row-value-changed', event)
    },
    onCustomRowValueChanged(event) {
      console.log('onCustomRowValueChanged: ', event)
    },
    onRowDeleteRequest(data) {
      console.log('onRowDeleteRequest: ', data)
    }
  },
}
</script>
