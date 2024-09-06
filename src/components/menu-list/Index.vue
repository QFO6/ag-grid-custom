<template>
  <div
    v-if="menuItemVisible(menuInfo)"
    class="map-menu-list"
  >
    <component
      :is="menuComponent"
      v-if="!menuInfo.hidden"
      v-show="menuItemShow(menuInfo)"
      :menu-info="menuInfo"
      :enable-tooltip="enableTooltip"
      @menu-changed="onMenuChanged"
    >
      <template v-if="menuInfo.children && menuInfo.children.length">
        <MenuList
          v-for="subMenuInfo in menuInfo.children"
          :key="subMenuInfo.name"
          :menu-info="subMenuInfo"
          :enable-tooltip="enableTooltip"
          :class="menuInfo.icon ? 'ml-10' : 'ml-4'"
          @menu-changed="onMenuChanged"
        />
      </template>
    </component>
  </div>
</template>

<script>
import ListItem from '@/components/menu-list/ListItem'
import ListGroup from '@/components/menu-list/ListGroup'

export default {
  name: 'MenuList',
  components: {
    ListItem,
    ListGroup,
  },
  props: {
    menuInfo: {
      default: function () {
        return null
      },
      type: Object,
    },
    enableTooltip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    menuComponent() {
      if (this.menuInfo.children && this.menuInfo.children.filter((item) => !item.hidden).length) {
        return 'ListGroup'
      } else {
        return 'ListItem'
      }
    },
  },
  methods: {
    menuItemVisible(item) {
      return (item && typeof item.hidden === 'undefined') || !item.hidden
    },
    menuItemShow(item) {
      if (!item.hidden) {
        return typeof item.show === 'undefined' ? true : item.show
      } else {
        return false
      }
    },
    onMenuChanged(event) {
      this.$emit('menu-changed', event)
    },
  },
}
</script>

<style>
.map-menu-list .v-list-item__icon {
  margin-right: 16px !important;
}
</style>
