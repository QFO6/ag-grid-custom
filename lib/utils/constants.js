import { isValidDateStr, formatDateStr } from 'lib/utils'

export const SPECIAL_GLOSSARY = []
export const AG_DEFAULT_PAGE_SIZE = 15
export const AG_DEFAULT_COUNTRY_LEN = 10
export const AG_DEFAULT_DATE_MIN_YEAR = 1800
export const AG_DEFAULT_GROUP_HEADER_NAME = 'Group'
export const SPECIAL_CHAR_REGEX = /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/

export const AG_TABLE_COLORS = {
  PINNED_CELL: 'blue lighten-0',
  PROGRESS_CELL: 'blue lighten-5',
}

// The reason is we should keep same style for all ranking cells
export const AG_TABLE_RANK_ICONS_CONFIG = [
  {
    rank: 1,
    attrs: {
      icon: 'mdi-star-circle',
      color: '#FFD700',
    },
  },
  {
    rank: 2,
    attrs: {
      icon: 'mdi-star-circle',
      color: '#C0C0C0',
    },
  },
  {
    rank: 3,
    attrs: {
      icon: 'mdi-star-circle',
      color: '#CD7F32',
    },
  },
]

/**
 * The default date filter params for ag tables
 */
export const AG_DEFAULT_DATE_FILTER_PARAMS = {
  debounceMs: 300,
  closeOnApply: true,
  minValidYear: AG_DEFAULT_DATE_MIN_YEAR,
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    if (!isValidDateStr(cellValue)) return -1

    const dateString = new Date(formatDateStr(cellValue)).toLocaleDateString()
    const dateParts = dateString.split('/') // mm/dd/YYYY
    const cellDate = new Date(Number(dateParts[2]), Number(dateParts[0]) - 1, Number(dateParts[1]))
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1
    }
  },
}

/***
 * The custom comparator for date columns when sorting in ag table
 * @param value1
 * @param value2
 * @returns {number}
 */
export const AG_DEFAULT_DATE_COMPARATOR = function (date1, date2) {
  if (!isValidDateStr(date1) && !isValidDateStr(date2)) {
    return 0
  }

  if (!isValidDateStr(date1)) {
    return -1
  }

  if (!isValidDateStr(date2)) {
    return 1
  }

  return new Date(date1).getTime() - new Date(date2).getTime()
}
