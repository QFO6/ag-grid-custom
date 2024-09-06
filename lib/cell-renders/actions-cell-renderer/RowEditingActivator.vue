<template>
  <div>
    <v-tooltip
      v-if="!isEditing"
      top
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="icon"
          icon
          x-small
          class="mr-2"
          :color="color"
          :disabled="disabled"
          v-on="on"
          @click="startRowEditing"
        >
          <!-- <v-icon small>
            {{ icon }}
          </v-icon> -->
          <i
            aria-hidden="true"
            :class="`v-icon notranslate mdi ${icon} theme--light`"
            style="font-size: 16px;"
          />
        </v-btn>
        <v-btn 
          v-else
          text
          x-small
          class="mr-2"
          :color="color"
          :disabled="disabled"
        >
          {{ name }}
        </v-btn>
      </template>
      <span v-if="tooltip">
        {{ tooltip }}
      </span>
      <span 
        v-else
        class="text-capitalize"
      >
        {{ name }}
      </span>
    </v-tooltip>
    <div v-else>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="success"
            icon
            x-small
            class="mr-2"
            v-bind="attrs"
            v-on="on"
            @click="stopRowEditing(false)"
          >
            <!-- <v-icon small>
              mdi-check-bold
            </v-icon> -->
            <i
              aria-hidden="true"
              :class="`v-icon notranslate mdi mdi-check-bold theme--light`"
              style="font-size: 16px;"
            />
          </v-btn>
        </template>
        <span>Save</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="error"
            icon
            x-small
            class="mr-2"
            v-bind="attrs"
            v-on="on"
            @click="stopRowEditing(true)"
          >
            <!-- <v-icon small>
              mdi-close-thick
            </v-icon> -->
            <i
              aria-hidden="true"
              :class="`v-icon notranslate mdi mdi-close-thick theme--light`"
              style="font-size: 16px;"
            />
          </v-btn>
        </template>
        <span>Cancel</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RowEditingActivator',
  props: {
    name: {
      type: String,
      default: 'inlineEdit',
    },
    icon: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: 'Edit',
    },
    color: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    startRowEditing() {
      if (this.disabled) return
      this.$emit('click', { name: 'startRowEditing' })
    },
    stopRowEditing(cancel) {
      if (this.disabled) return
      this.$emit('click', { name: 'stopRowEditing', cancel })
    },
  },
}
</script>
