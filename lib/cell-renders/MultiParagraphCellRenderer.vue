<template>
  <div class="text-wrapper">
    {{ content }}
  </div>
</template>

<script>
import cellRenderMixin from 'lib/mixins/cellRenderMixin'

export default {
  name: 'MultiParagraphCellRenderer',
  mixins: [cellRenderMixin],
  data() {
    return {
      content: '',
    }
  },
  created() {
    this.formatData()
  },
  methods: {
    formatData() {
      this.content = this.params.value || 'N/A'
    },
  },
}
</script>

<style scoped>
.text-wrapper {
  white-space: pre-line;
  text-align: justify;
}
</style>
