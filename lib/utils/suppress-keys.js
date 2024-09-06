/**
 * 
 * @param {*} params 
 * @returns {*|boolean}
 * Blocks enter. Enter will not start or stop editing.
 */
export function suppressEnter(params) {
  var KEY_ENTER = 'Enter'
  var event = params.event
  var key = event.key
  var suppress = key === KEY_ENTER
  return suppress
}

/**
 * 
 * @param {*} params 
 * @returns {*|boolean}
 * Page Up and Page Down will not get handled by the grid.
 * Home will not focus top left cell.
 * End will not focus bottom right cell.
 * ← ↑ → ↓ Arrow keys will not navigate focused cell.
 * F2 will not start editing.
 * Delete will not start editing.
 * Backspace will not start editing.
 * Escape will not cancel editing.
 * Space will not select current row.
 * Tab will not be handled by the grid.
 */
export function suppressNavigation(params) {
  // var KEY_A = 'A'
  // var KEY_C = 'C'
  // var KEY_V = 'V'
  // var KEY_D = 'D'
  var KEY_PAGE_UP = 'PageUp'
  var KEY_PAGE_DOWN = 'PageDown'
  var KEY_TAB = 'Tab'
  var KEY_LEFT = 'ArrowLeft'
  var KEY_UP = 'ArrowUp'
  var KEY_RIGHT = 'ArrowRight'
  var KEY_DOWN = 'ArrowDown'
  var KEY_F2 = 'F2'
  var KEY_BACKSPACE = 'Backspace'
  var KEY_ESCAPE = 'Escape'
  var KEY_SPACE = ' '
  var KEY_DELETE = 'Delete'
  var KEY_PAGE_HOME = 'Home'
  var KEY_PAGE_END = 'End'
  var event = params.event
  var key = event.key
  var keysToSuppress = [KEY_PAGE_UP, KEY_PAGE_DOWN, KEY_TAB, KEY_F2, KEY_ESCAPE]
  var editingKeys = [
    KEY_LEFT,
    KEY_RIGHT,
    KEY_UP,
    KEY_DOWN,
    KEY_BACKSPACE,
    KEY_DELETE,
    KEY_SPACE,
    KEY_PAGE_HOME,
    KEY_PAGE_END,
  ]
  // if (event.ctrlKey || event.metaKey) {
  //   keysToSuppress.push(KEY_A)
  //   keysToSuppress.push(KEY_V)
  //   keysToSuppress.push(KEY_C)
  //   keysToSuppress.push(KEY_D)
  // }
  if (!params.editing) {
    keysToSuppress = keysToSuppress.concat(editingKeys)
  }

  var suppress = keysToSuppress.some(function (suppressedKey) {
    return suppressedKey === key || key.toUpperCase() === suppressedKey
  })
  return suppress
}

export function suppressUpDownNavigation(params) {
  var key = params.event.key
  return key === 'ArrowUp' || key === 'ArrowDown'
}
