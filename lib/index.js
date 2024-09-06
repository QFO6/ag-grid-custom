import 'ag-grid-enterprise'
import { NumericCellEditor } from './cell-editors'

import { VServerPaginatedAgTable, VClientPaginatedAgTable } from './tables'

import {
  LinkCellRenderer,
  RankCellRenderer,
  TooltipCellRenderer,
  ActionsCellRenderer,
  CountryCellRenderer,
  ShowMoreCellRenderer,
  ProgressCellRenderer,
  MultiLinkCellRenderer,
  PinnedRowCellRenderer,
  MultiParagraphCellRenderer,
} from './cell-renders'

// Declare install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true

  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  Vue.component('link-cell-renderer', LinkCellRenderer)
  Vue.component('rank-cell-renderer', RankCellRenderer)
  Vue.component('tooltip-cell-renderer', TooltipCellRenderer)
  Vue.component('actions-cell-renderer', ActionsCellRenderer)
  Vue.component('country-cell-renderer', CountryCellRenderer)
  Vue.component('show-more-cell-renderer', ShowMoreCellRenderer)
  Vue.component('progress-cell-renderer', ProgressCellRenderer)
  Vue.component('multi-link-cell-renderer', MultiLinkCellRenderer)
  Vue.component('pinned-row-cell-renderer', PinnedRowCellRenderer)
  Vue.component('multi-paragraph-cell-renderer', MultiParagraphCellRenderer)
  Vue.component('v-server-paginated-ag-table', VServerPaginatedAgTable)
  Vue.component('v-client-paginated-ag-table', VClientPaginatedAgTable)
}

const AgGridCustom = {
  install,
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(AgGridCustom)
}

// To allow use as module (npm/webpack/etc.) export component
export default AgGridCustom

// export all components as vue plugin
export {
  VServerPaginatedAgTable,
  VClientPaginatedAgTable,
  NumericCellEditor,
  LinkCellRenderer,
  RankCellRenderer,
  TooltipCellRenderer,
  ActionsCellRenderer,
  CountryCellRenderer,
  ShowMoreCellRenderer,
  ProgressCellRenderer,
  MultiLinkCellRenderer,
  PinnedRowCellRenderer,
  MultiParagraphCellRenderer,
}
