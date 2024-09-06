/**
 * Truncate long string with ellipsis.
 * @param {*} maxLength - the maximum length of a string
 */
export function longTextFormatter(maxLength = 200) {
  return function (params) {
    if (typeof params.value !== 'string') {
      return params.value
    }

    let formattedValue =
      params.value.length > maxLength ? params.value.substring(0, maxLength) : params.value

    // avoid last word from being cut off
    const lastBlackIndex = formattedValue.lastIndexOf(' ')
    if (lastBlackIndex < 0) {
      formattedValue =
        formattedValue.length === maxLength
          ? formattedValue.substring(0, formattedValue.length) + ' ...'
          : formattedValue
    } else {
      formattedValue =
        formattedValue.length === maxLength
          ? formattedValue.substring(0, Math.min(formattedValue.length, lastBlackIndex)) + ' ...'
          : formattedValue
    }
    return formattedValue
  }
}

/**
 * Truncate long ZH string with ellipsis.
 * @param {*} maxLength - the maximum length of a string
 */
export function longZhTextFormatter(maxLength = 200) {
  return function (params) {
    if (typeof params.value !== 'string') {
      return params.value
    }

    const zhMaxLength = parseInt(`${(maxLength * 6) / 11}`)

    let formattedValue =
      params.value.length > zhMaxLength ? params.value.substring(0, zhMaxLength) : params.value

    // avoid last word from being cut off
    const lastBlackIndex = formattedValue.lastIndexOf(' ')
    if (lastBlackIndex < 0) {
      // in case there is no any blank in the string
      formattedValue =
        formattedValue.length === zhMaxLength
          ? formattedValue.substring(0, formattedValue.length) + ' ...'
          : formattedValue
    } else {
      formattedValue =
        formattedValue.length === zhMaxLength
          ? formattedValue.substring(0, Math.min(formattedValue.length, lastBlackIndex)) + ' ...'
          : formattedValue
    }
    return formattedValue
  }
}
