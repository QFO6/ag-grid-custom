<template>
  <div class="d-flex justify-center align-center">
    <v-card 
      flat 
      max-width="50%"
      color="transparent"
    >
      <v-img
        contain
        alt="no data"
        :max-height="maxHeight"
      />
      <!-- :src="require('lib/assets/images/empty-state.svg')" -->
      <v-card-title 
        v-if="title" 
        class="justify-center no-rows-text"
      >
        {{ title }}
      </v-card-title>
      <v-card-subtitle class="py-0 text-wrap">
        {{ message }}
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BaseNoDataPlaceholder',
  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: 'No Data',
    },
    maxHeight: {
      type: [Number, String],
      default: 200,
    },
    options: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
}
</script>

<style scoped>
.no-rows-text {
  font-size: 0.875rem;
  font-weight: 500 !important;
  text-transform: capitalize;
}
</style>
