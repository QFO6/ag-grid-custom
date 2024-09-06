<template>
  <div style="width: 110px">
    <v-select
      v-model="selectedItem"
      :items="items"
      :label="label"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :menu-props="menuProps"
      :full-width="fullWidth"
      :hide-details="hideDetails"
      :single-line="singleLine"
      class="ag-grid-page-size"
      color="primary"
      dense
      @change="onInputChanged"
    >
      <template #prepend />
    </v-select>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { AG_DEFAULT_PAGE_SIZE } from 'lib/utils/constants'

export default {
  name: 'AgTablePageSize',
  components: {},
  mixins: [],
  props: {
    gridOptions: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      default() {
        return [
          {
            text: '10 Rows',
            value: 10,
          },
          {
            text: '15 Rows',
            value: 15,
          },
          {
            text: '20 Rows',
            value: 20,
          },
          {
            text: '50 Rows',
            value: 50,
          },
          {
            text: '100 Rows',
            value: 100,
          },
          {
            text: '1000 Rows',
            value: 1000,
          },
        ]
      },
    },
    prependIcon: {
      type: String,
      default: '',
    },
    appendIcon: {
      type: String,
      default: '$dropdown',
    },
    label: {
      type: String,
      default: 'Page Size',
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    singleLine: {
      type: Boolean,
      default: true,
    },
    hideDetails: {
      type: Boolean,
      default: true,
    },
    menuProps: {
      type: [String, Array, Object],
      default: 'auto',
    },
  },
  data() {
    return {
      selectedItem: AG_DEFAULT_PAGE_SIZE,
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
  mounted() {
    if (this.gridOptions && this.gridOptions.paginationPageSize) {
      this.selectedItem = this.gridOptions.paginationPageSize
    }
  },
  methods: {
    onInputChanged: debounce(function (value) {
      if (!this.gridApi) {
        this.showError('Only support ag table, please provide valid ag options')
        return
      }

      this.gridApi.paginationSetPageSize(Number(value))
    }, 280),
  },
}
</script>

<style>
.ag-grid-page-size {
  border: 1px solid #3f51b5;
  border-radius: 4px;
}

.ag-grid-page-size .v-select__selection--comma {
  color: #3f51b5 !important;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.0892857143em;
  text-indent: 0.0892857143em;
  margin: 0 0 0 0.6rem !important;
}

.ag-grid-page-size .v-input__icon > .v-icon {
  margin: 0 !important;
}
</style>
