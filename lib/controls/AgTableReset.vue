<template>
  <div>
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn
          icon
          :x-small="xSmall"
          :small="small"
          :large="large"
          :x-large="xLarge"
          :color="color"
          v-on="on"
          @click.stop="onResetAgTableClicked"
        >
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </template>
      <span>Refresh table</span>
    </v-tooltip>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'AgTableExporter',
  components: {},
  mixins: [],
  props: {
    gridOptions: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      default: 'mdi-download',
    },
    color: {
      type: String,
      default: '',
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
    xLarge: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
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
    onResetAgTableClicked: debounce(function () {
      if (!this && !this.gridApi) {
        // eslint-disable-next-line
        console.error("Unknown error occurred, please try again later.")
        return
      }

      try {
        this.gridApi.setFilterModel(null)
        this.gridApi.setSortModel(null)
        this.gridApi.paginationGoToPage(0)
        this.gridOptions.columnApi.resetColumnState()
        if (typeof this.$emit == "function") {
          this.$emit('grid-refresh-request')
        }
      } catch (e) {
        // eslint-disable-next-line
        console.error(e)
      }
    }, 300),
  },
}
</script>
