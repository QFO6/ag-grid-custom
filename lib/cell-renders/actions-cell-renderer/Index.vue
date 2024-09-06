<template>
  <div class="d-flex flex-row">
    <template v-for="(action, index) in actions">
      <div
        v-if="!action.component"
        :key="`${index}_${action}`"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              x-small
              :color="color"
              :disabled="isCurrentEditingRow"
              class="mr-2"
              v-on="on"
              @click="onClick(action)"
            >
              <!-- <v-icon small>
                {{ action.icon }}
              </v-icon> -->
              <i
                aria-hidden="true"
                :class="`v-icon notranslate mdi ${action.icon} theme--light`"
                style="font-size: 16px;"
              />
            </v-btn>
          </template>
          <span v-if="action.tooltip">
            {{ action.tooltip }}
          </span>
          <span 
            v-else
            class="text-capitalize"
          >
            {{ action.name }}
          </span>
        </v-tooltip>
      </div>
      <component
        :is="action.component"
        v-else
        :key="`${index}_${action}`"
        v-bind="action"
        @click="onClick"
      />
    </template>
  </div>
</template>

<script>
import { has, find, isEmpty } from 'lodash'
import cellRenderMixin from 'lib/mixins/cellRenderMixin'
import RowEditingActivator from 'lib/cell-renders/actions-cell-renderer/RowEditingActivator'

export default {
  name: 'ActionsCellRenderer',
  components: {
    RowEditingActivator,
  },
  mixins: [cellRenderMixin],
  data() {
    return {
      gridApi: null,
      color: '',
      actions: [],
      defaultActions: {
        view: {
          icon: 'mdi-open-in-new',
          tooltip: 'View',
          event: 'row-view-request',
        },
        edit: {
          icon: 'mdi-pencil',
          tooltip: 'Edit',
          event: 'row-edit-request',
        },
        inlineEdit: {
          icon: 'mdi-pencil',
          tooltip: 'Edit',
          event: 'row-update-request',
          component: 'RowEditingActivator',
        },
        add: {
          icon: 'mdi-plus',
          tooltip: 'Add',
          event: 'row-add-request',
        },
        delete: {
          icon: 'mdi-trash-can',
          tooltip: 'Delete',
          event: 'row-delete-request',
        },
        comment: {
          icon: 'mdi-message-text',
          tooltip: 'Add comment',
          event: 'row-comment-request',
        },
      },
      isCurrentEditingRow: false,
    }
  },
  mounted() {
    this.gridApi = this.params.api

    // Checks if the rowIndex matches at least one of the editing cells
    const editingCells = this.gridApi.getEditingCells()
    this.isCurrentEditingRow = editingCells.some((cell) => {
      return this.params.node.rowIndex === cell.rowIndex
    })

    // console.log('actionsCellRender mounted, rowIndex: ', this.params.node.rowIndex, ', isCurrentEditingRow: ', this.isCurrentEditingRow, ', editingCells: ', editingCells, ', params: ', this.params)

    // Handles cellRendererParams
    this.actions = this.getActionsDef()
    this.color = this.params.color || 'primary'
  },
  methods: {
    onClick(action) {
      switch (action.name) {
        case 'startRowEditing':
          this.startRowEditing()
          break
        case 'stopRowEditing':
          this.stopRowEditing(action.cancel)
          break
        default:
          this.params.context.componentParent.$emit(action.event, {
            params: this.params,
            data: this.params.data,
          })
      }
    },
    getActionsDef() {
      // Skips the grouping row
      // if (!this.params || !this.params.data || !this.params.actions) return []
      const actions = this.params.actions.reduce((acc, action) => {
        try {
          if (typeof action === 'string' && has(this.defaultActions, action)) {
            acc.push({
              name: action,
              ...this.defaultActions[action],
            })
          } else if (typeof action === 'object' && !Array.isArray(action) && !isEmpty(action)) {
            acc.push(action)
          } else {
            throw new Error('actions should either be a list of non-empty strings or objects')
          }
          return acc
        } catch (e) {
          // eslint-disable-next-line
          console.error(`Invalid cellRendererParams: ${e}`)
        }
      }, [])

      // Handles inline edit
      const inlineEdit = find(actions, { name: 'inlineEdit' })
      if (inlineEdit) {
        const editingCells = this.gridApi.getEditingCells()
        inlineEdit.isEditing = this.isCurrentEditingRow
        inlineEdit.disabled = editingCells.length > 0 && !this.isCurrentEditingRow
      }

      return actions
    },
    startRowEditing() {
      const rowIndex = this.params.rowIndex
      const colKey = this.params.context.componentParent.getFirstEditableColumn()
      if (colKey) {
        this.gridApi.setFocusedCell(rowIndex, colKey)
        this.gridApi.startEditingCell({
          rowIndex,
          colKey,
        })
      }
    },
    stopRowEditing(cancel) {
      if (!cancel) {
        this.params.context.componentParent.$emit('row-update-request', {
          params: this.params,
          data: this.params.data,
          rowIndex: this.params.rowIndex,
        })
      }
      this.gridApi.stopEditing(cancel)
    },
  },
}
</script>
