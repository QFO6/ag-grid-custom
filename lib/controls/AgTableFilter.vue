<template>
  <div v-if="visible">
    <v-text-field
      dense
      clearable
      single-line
      class="pl-2"
      label="Search"
      hint="Use & to search multiple texts"
      :error="error"
      :prepend-icon="icon"
      :full-width="fullWidth"
      :hide-details="hideDetails"
      :error-messages="errorMessages"
      @input="onInputChanged"
      @click:clear="onClearClicked"
    />
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'AgTableFilter',
  components: {},
  mixins: [],
  props: {
    gridOptions: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      default: 'mdi-magnify',
    },
    label: {
      type: String,
      default: 'Search',
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    hideDetails: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      error: false,
      errorMessages: [],
    }
  },
  computed: {
    gridApi() {
      if (this.gridOptions && this.gridOptions.api) {
        return this.gridOptions.api
      }
      return null
    },
  },
  methods: {
    onInputChanged: debounce(function (value) {
      this.clearError()
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        if (this.gridApi) this.gridApi.setQuickFilter('')
        return
      }

      if (!this.gridApi) {
        this.showError('Only support ag table, please provide valid ag options')
        return
      }

      const values = value.split('&').map((item) => {
        return item.trim().split(' ').join('_')
      })
      this.gridApi.setQuickFilter(values.join(' '))
    }, 280),
    onClearClicked() {
      this.clearError()
      if (this.gridApi) this.gridApi.setQuickFilter('')
    },
    clearError() {
      this.error = false
      this.errorMessages = []
    },
    showError(msg) {
      this.error = true
      this.errorMessages.push(msg)
    },
  },
}
</script>
