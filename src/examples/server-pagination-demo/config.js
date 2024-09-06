export const TABLE_CONFIG = {
  columnDefs: [
    { field: 'id' },
    { field: 'postId', headerName: 'Post ID', pinned: 'left' },
    { field: 'name', headerName: 'Name', filter: false },
    { field: 'email', headerName: 'Email' },
    {
      field: 'body',
      headerName: 'Content',
      /**
       *  For the column with extremely long text, it is recommended to automatically calculate the row
       *  height based on the content of the cells by setting both wrapText = true and autoHeight = true
       */
      wrapText: true,
      autoHeight: true,
    },
  ],
  hiddenCols: ['id'],
  defaultColDef: {
    flex: 1,
    // Enable checkbox selection on first visible column
    checkboxSelection: function (params) {
      const displayedColumns = params.columnApi.getAllDisplayedColumns()
      const thisIsFirstColumn = displayedColumns[0] === params.column
      return thisIsFirstColumn
    },
  },
  gridOptions: {
    /* paginationPageSize is 10 by default */
    // paginationPageSize: 20,
    // cacheBlockSize: 20,

    /* Checkbox Row Selection */
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
  },
  toolbarOptions: {
    searchable: false,
  },
  noRowsText: 'No Matched Records Found',
}
