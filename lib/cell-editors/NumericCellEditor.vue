<template>
  <input 
    :ref="'input'" 
    v-model="value"
    type="number"
    :step="step"
    :min="min"
    :max="max"
    style="width: 100%"
    @keydown="onKeyDown($event)" 
  >
</template>

<script>
import { has } from 'lodash'
import { nextTick } from 'vue'

const KEY_BACKSPACE = 'Backspace'
const KEY_ESCAPE = 'Escape'
const KEY_DELETE = 'Delete'
const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'
// const KEY_F2 = 'F2' // TODO

export default {
  name: 'NumericCellEditor',
  data() {
    return {
      value: null,
      type: 'integer', // or 'float'
      min: -2147483648,
      max: 2147483647,
      step: 1,
      cancelBeforeStart: true,
    }
  },
  created() {
    this.setInitialState(this.params)

    if (['integer', 'float'].indexOf(this.params.type) > -1) {
      this.type = this.params.type
    }
    ['min', 'max', 'step'].forEach(prop => {
      if (has(this.params, prop)) {
        try {
          if (typeof this.params[prop] !== 'number') {
            throw new Error(`Type check failed for ${prop} property. Expect a number, but got a ${typeof this.params[prop]}.`)
          }
          this[prop] = this.params[prop]
        } catch (e) {
          console.error(`An error occurred while initializing NumericCellEditor. ${e.message}`)
        }
      }
    })

    // TODO: only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart =
      this.params.charPress && '1234567890'.indexOf(this.params.charPress) < 0
  },
  mounted() {
    nextTick(() => {
      // need to check if the input reference is still valid - if the edit was cancelled before it started there
      // wont be an editor component anymore
      if (this.$refs.input) {
        this.$refs.input.focus()
      }
    })
  },
  methods: {
    /* Component Editor Lifecycle methods */
    // The final value to send to the grid, on completion of editing
    getValue() {
      let value
      if (this.type === 'float') {
        value = parseFloat(this.value)
      } else {
        value = parseInt(this.value)
      }
      if (isNaN(value)) {
        return this.type === 'float' ? 0.0 : 0
      }
      return value
    },
    // Gets called once before editing starts, to give editor a chance to cancel the editing before it even starts.
    isCancelBeforeStart() {
      return this.cancelBeforeStart
    },
    // Gets called once when editing is finished (eg if Enter is pressed). If return true, the result of the edit will be ignored.
    isCancelAfterEnd() {
      return !this.isValidNumber(this.value)
    },
    setInitialState(params) {
      let startValue
      if (params.eventKey === KEY_BACKSPACE || params.eventKey === KEY_DELETE) {
        // if backspace or delete pressed, we clear the cell
        startValue = ''
      } else if (params.charPress) {
        // if a letter was pressed, we start with the letter
        startValue = params.charPress
      } else {
        // otherwise we start with the current value
        startValue = params.value
      }
      this.value = startValue
    },
    onKeyDown(event) {
      if (event.key === KEY_ESCAPE) {
        return
      }
      if (this.isLeftOrRight(event) || this.deleteOrBackspace(event)) {
        event.stopPropagation()
        return
      }
      if (!this.finishedEditingPressed(event) && !this.isKeyPressedNumeric(event)) {
        if (event.preventDefault) event.preventDefault()
      }
    },
    isValidNumber(value) {
      const regex = /^-?(\d+)?(\.\d+)?$/
      if (regex.test(value)) {
        value = (this.type === 'float') ? parseFloat(value) : parseInt(value)
        if (isNaN(value)) return false
        return (value >= this.min) && (value <= this.max)
      }
      return false
    },
    isCharNumeric(charStr) {
      if (this.type === 'float') {
        return this.min < 0
          ? /-|\.|\d/.test(charStr)
          : /\.|\d/.test(charStr)
      }
      return this.min < 0
        ? /-|\d/.test(charStr)
        : /\d/.test(charStr)
    },
    isKeyPressedNumeric(event) {
      const charStr = event.key
      return this.isCharNumeric(charStr)
    },
    finishedEditingPressed(event) {
      const key = event.key
      return key === KEY_ENTER || key === KEY_TAB
    },
    deleteOrBackspace(event) {
      return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.key) > -1
    },
    isLeftOrRight(event) {
      return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1
    },
  },
}
</script>
