<template>
  <div v-if="items">
    <ul>
      <li
        v-for="({ text, href }, index) of items"
        :key="index"
      >
        <a
          v-if="href"
          :href="href"
          :target="_blank"
        >
          <span>
            {{ text }}
          </span>
        </a>
        <span v-else>
          {{ text }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import cellRenderMixin from 'lib/mixins/cellRenderMixin'

export default {
  name: 'MultiLinkCellRenderer',
  mixins: [cellRenderMixin],
  data() {
    return {
      items: null,
    }
  },
  created() {
    this.items = this.params.valueFormatted
  },
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
ul li {
  display: inline-block;
}
ul li:not(:last-child):after {
  content: ',';
}
ul > li:not(:first-child) {
  padding-left: 0.25rem;
}
</style>
