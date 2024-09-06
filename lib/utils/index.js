import XLSX from 'sheetjs-style'
import { SPECIAL_GLOSSARY, AG_DEFAULT_DATE_MIN_YEAR } from 'lib/utils/constants'

export function capitalize(value) {
  if (!value) return ''
  let words = value.toString().toLowerCase().split(' ')
  words = words.map((word) => {
    if (SPECIAL_GLOSSARY.includes(word)) return word.toUpperCase()
    else return word.charAt(0).toUpperCase() + word.slice(1)
  })
  return words.join(' ')
}

/***
 *
 * Download the data as excel file.
 * @param excelData [Array] An array excel sheetName and data. example:
 * [{
 *   sheetData: [['test', 'test'],['1', '2']],
 *   sheetName: 'sheet1',
 *   fitColumn: true,
 *   rowOpts: [{ hpt: 25 }, { hpt: 40 }, { hpt: 40 }]
 * },
 * {
 *   sheetData: [['test1', 'test1'],['12', '22']],
 *   sheetName: 'sheet2'
 * }]
 * @param storedFileName [String]
 */
export function downloadExcel(excelData = [], storedFileName = 'export.xlsx') {
  return new Promise((resolve, reject) => {
    if (isEmptyArray(excelData)) {
      reject('There is no data provided')
      return
    }

    try {
      const sheetNames = []
      const workSheets = {}
      const fitToColumn = (data) => {
        const columnWidths = []
        for (const property in data[0]) {
          columnWidths.push({
            wch: Math.max(
              property ? Math.min(property.toString().length + 2, 100) : 0,
              ...data.map((obj) =>
                obj[property] ? Math.min(obj[property].toString().length + 2, 100) : 0
              )
            ),
          })
        }
        return columnWidths
      }
      excelData.forEach((item, index) => {
        if (!isEmptyArray(item['sheetData'])) {
          const sheetName = item['sheetName'] || `sheet${index + 1}`
          sheetNames.push(sheetName)
          if (item['sheetData'].length === 1 && isEmptyArray(item['sheetData'][0])) {
            item['sheetData'][0] = ['No data found']
          }
          let sheet = XLSX.utils.aoa_to_sheet(item['sheetData'])
          sheet = Object.entries(sheet).reduce((acc, [key, value]) => {
            if (key) {
              if (key.startsWith('!')) {
                acc[key] = value
              } else {
                acc[key] = {
                  ...value,
                  s: {
                    // for more settings ref to https://www.npmjs.com/package/xlsx-style#cell-styles
                    font: {
                      sz: 12,
                      color: { rgb: '000000' },
                      // bold: true,
                    },
                    alignment: {
                      // horizontal: 'center',
                      vertical: 'center',
                      wrapText: true,
                    },
                  },
                }
              }
            }
            return acc
          }, {})
          if (item.fitColumn) sheet['!cols'] = fitToColumn(item['sheetData'])
          if (item.rowOpts) sheet['!rows'] = item.rowOpts
          workSheets[sheetName] = sheet
        }
      })
      let url = sheetsToBlob(sheetNames, workSheets)
      if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url)
      }
      let aLink = document.createElement('a')
      aLink.href = url.toString()
      aLink.download = storedFileName
      let event
      if (window.MouseEvent) {
        event = new MouseEvent('click')
      } else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        )
      }
      aLink.dispatchEvent(event)
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })
}

/***
 *
 * Download the data as CSV file.
 * @param csvData [Array] An array csv data. example:
 * [
 * ['col1', 'col2'],
 * ['12', '22']
 * ]
 * @param storedFileName [String]
 */
export function downloadCsv(csvData = [[]], storedFileName = 'export.csv') {
  return new Promise((resolve, reject) => {
    try {
      let processRow = function (row) {
        let finalVal = ''
        for (let j = 0; j < row.length; j++) {
          let innerValue = row[j] === null ? '' : row[j].toString()
          if (row[j] instanceof Date) {
            innerValue = row[j].toLocaleString()
          }
          let result = innerValue.replace(/"/g, '""')
          if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"'
          if (j > 0) finalVal += ','
          finalVal += result
        }
        return finalVal + '\n'
      }

      let csvFileContent = ''
      for (const row of csvData) {
        csvFileContent += processRow(row)
      }

      let blob = new Blob([csvFileContent], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, storedFileName)
        resolve(true)
      } else {
        let link = document.createElement('a')
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          let url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', storedFileName)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          let event
          if (window.MouseEvent) {
            event = new MouseEvent('click')
          } else {
            event = document.createEvent('MouseEvents')
            event.initMouseEvent(
              'click',
              true,
              false,
              window,
              0,
              0,
              0,
              0,
              0,
              false,
              false,
              false,
              false,
              0,
              null
            )
          }
          link.dispatchEvent(event)
          resolve(true)
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function sheetsToBlob(sheetNames, workSheets) {
  if (isEmptyArray(sheetNames) || isEmptyArray(sheetNames)) return

  let workbook = {
    SheetNames: sheetNames,
    Sheets: workSheets,
  }
  let outStream = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
  })

  let blob = new Blob([strToaArrayBuff(outStream)], {
    type: 'application/octet-stream',
  })

  function strToaArrayBuff(s) {
    let buf = new ArrayBuffer(s.length)
    let view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }
  return blob
}

/**
 * Check an object is an Empty array or not
 * @param object
 * @returns {boolean}
 */
export function isEmptyArray(object) {
  return !object || !Array.isArray(object) || object.length === 0
}

/**
 * Check whether an object is a valid string or not
 * @param object
 * @returns {*|boolean}
 */
export function isValidString(object) {
  return object && typeof object === 'string' && object.trim().length > 0
}

/**
 * construct the ssrm params
 * @param object
 * @returns {object}
 */
export const mapToSsrmParams = function (request) {
  if (!request) return {}

  let sorts = []
  let filters = []
  let row_group = {}
  const end = request.endRow || 0
  const start = request.startRow || 0

  if (Array.isArray(request.sortModel)) {
    sorts = request.sortModel.map((item) => {
      return {
        field: formatFieldName(item['colId']),
        ascending: item['sort'] === 'asc',
      }
    })
  }

  if (request.filterModel) {
    Object.keys(request.filterModel).forEach(function (key) {
      const filterItem = request.filterModel[key]

      if (typeof filterItem['filterType'] === 'string' && filterItem['filterType']) {
        const conditions = []
        if (filterItem['operator']) {
          const condition1 = constructCondition(filterItem['condition1'])
          if (condition1) conditions.push(condition1)
          const condition2 = constructCondition(filterItem['condition2'])
          if (condition1) conditions.push(condition2)
        } else {
          const condition = constructCondition(filterItem)
          if (condition) conditions.push(condition)
        }

        filters.push({
          field: formatFieldName(key),
          field_type: filterItem['filterType'].toUpperCase(),
          operator: (filterItem['operator'] || '').toUpperCase() || 'AND',
          conditions: conditions,
        })
      }
    })
  }

  if (request.rowGroupCols) {
    const rowGroupCols = request.rowGroupCols
    const valueCols = request.valueCols
    const groupKeys = request.groupKeys

    let group_keys = []
    const aggregations = []
    const row_group_cols = []

    if (Array.isArray(rowGroupCols)) {
      rowGroupCols.forEach((item) => {
        if (item && (item['id'] || item['field'])) {
          row_group_cols.push(`${formatFieldName(item['id'] || item['field'])}`)
        }
      })
    }
    if (Array.isArray(groupKeys)) {
      group_keys = groupKeys.map((item) => `${formatFieldName(item)}`)
    }
    if (Array.isArray(valueCols)) {
      valueCols.forEach((item) => {
        if (item && (item['id'] || item['field']) && item['aggFunc']) {
          aggregations.push({
            field: formatFieldName(item['id'] || item['field']),
            agg_func: item['aggFunc'],
          })
        }
      })
    }

    row_group = { group_keys, row_group_cols, aggregations }
  }

  const size = end - start

  return { start, size, sorts, row_group, filters }
}

function formatFieldName(fieldName) {
  if (typeof fieldName !== 'string' || !fieldName.trim()) return

  const tempArr = fieldName.trim().split('_')
  if (Number.isNaN(Number(tempArr[tempArr.length - 1]))) {
    return fieldName
  } else {
    tempArr.pop()
    return tempArr.join('_')
  }
}

function constructCondition(filterItem) {
  if (!filterItem || typeof filterItem['type'] !== 'string' || !filterItem['type']) return

  let values = []
  let condition_type = filterItem['type'].toUpperCase()

  if (typeof filterItem['filter'] !== 'undefined') {
    values.push(`${filterItem['filter']}`.trim())
    if (typeof filterItem['filterTo'] !== 'undefined')
      values.push(`${filterItem['filterTo']}`.trim())
  } else {
    if (typeof filterItem['dateFrom'] !== 'undefined') {
      values.push(`${filterItem['dateFrom']}`.trim())
    }
    if (typeof filterItem['dateTo'] !== 'undefined') {
      values.push(`${filterItem['dateTo']}`.trim())
    }
  }

  return { condition_type, values }
}

// Converts JSON string into an object; returns null is the text is empty or undefined
export function parseJSON(text) {
  if (!text) return null
  if (typeof text !== 'string') {
    // eslint-disable-next-line
    console.error(`JSON.parse does not allow ${typeof text}`)
    return null
  }
  try {
    const tempStr = text.replace(/NaN/g, `"NaN"`)
    return JSON.parse(tempStr)
  } catch (e) {
    // eslint-disable-next-line
    console.error(`Parsing ${text} failed with error: ${e}`)
    return null
  }
}

/**
 *
 * @param {*} colDefs
 * @param {*} field
 * @returns Returns the matched colDef, else undefined.
 */
export function findColumnProp(colDefs, field) {
  return colDefs.find((colDef) => {
    if (typeof colDef['field'] === 'string' && colDef['field'] === field) {
      return true
    } else if (Object.prototype.toString.call(colDef['field']) === '[object RegExp]') {
      const regex = new RegExp(colDef['field'])
      return regex.test(field)
    } else {
      return false
    }
  })
}

/***
 * Check a string is valid date string or not
 * @param {string} str the given string
 * @returns {boolean}
 */
export const isValidDateStr = function (str) {
  return isValidString(str) && !isNaN(new Date(str).getTime())
}

/**
 * Format the date string
 * @param {string} value the given string to be format
 * @returns {string}
 */
export const formatDateStr = function (value) {
  if (!isValidDateStr(value)) return `${AG_DEFAULT_DATE_MIN_YEAR}`

  let dateStr = value
  // remove time
  if (dateStr.indexOf(':') > 0) {
    const tempArr1 = dateStr.trim().split(/ |T/)
    const found = find(tempArr1, (item) => item.indexOf(':') < 0)
    if (found) dateStr = found
  }

  let tempArr = dateStr.replace(/\s/g, '').split(/-| |,|\/|\\|\.|=|!|@|#|$|%|^|&|\*/)

  if (tempArr.length === 0) return `${AG_DEFAULT_DATE_MIN_YEAR}`

  if (tempArr.length === 3) {
    tempArr = tempArr.map((item, index) => {
      if (index === 0 && item.length < 4) {
        // for year
        return AG_DEFAULT_DATE_MIN_YEAR
      }
      return item
    })
  }
  if (
    (tempArr.length === 2 && tempArr[0].length < 4) ||
    (tempArr.length === 1 && tempArr[0].length < 4)
  ) {
    tempArr.unshift(AG_DEFAULT_DATE_MIN_YEAR)
  }
  return tempArr.join('-')
}
