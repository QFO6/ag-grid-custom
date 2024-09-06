/**
 * 
 * @param {*} params 
 * @returns the output of valueFormatter if valueFormatter is provided while
 * the valueGetter is not. Otherwise, returns params.value
 */
 export function processCellCallback(params) {
  const colDef = params.column.getColDef()
  if (colDef.valueFormatter && !colDef.valueGetter) {
    const valueFormatterParams = {
      ...params,
      data: params.node.data,
      colDef: params.column.getColDef(),
    }
    return colDef.valueFormatter(valueFormatterParams)
  }
  return params.value
}