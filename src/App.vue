<template>
  <v-app id="app">
    <v-main>
      <v-navigation-drawer
        app
        permanent
      >
        <v-list-item
          link
          to="/"
        >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list
          nav
          dense
          expand
        >
          <div
            v-for="item in menuItems"
            :key="item.title"
          >
            <menu-list
              v-if="!item.hidden"
              :key="item.name"
              :menu-info="item"
              class="py-0"
            />
          </div>
        </v-list>
      </v-navigation-drawer>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { routes } from '@/router'
import MenuList from '@/components/menu-list/Index'
export default {
  name: 'App',
  components: { MenuList },
  data() {
    return {
      menuItems: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.menuItems = this.formatMenu(routes)
  },
  methods: {
    formatMenu(items) {
      if (!Array.isArray(items) || !items.length) return []

      return items.reduce((acc, routeItem) => {
        if (
          routeItem &&
          routeItem.name !== 'Home' &&
          routeItem.meta &&
          routeItem.meta.hidden !== true
        ) {
          const menuItem = {
            name: routeItem.name,
            sort: routeItem.sort,
            hidden: routeItem.meta.hidden,
            icon: routeItem.meta && routeItem.meta.icon ? routeItem.meta.icon : 'mdi-message',
            title: routeItem.meta && routeItem.meta.title ? routeItem.meta.title : routeItem.name,
            location: {
              name: routeItem.name,
              params: routeItem['parameters'] || {},
            },
            children: [],
          }
          if (routeItem.children) {
            menuItem.children = this.formatMenu(routeItem.children)
          }
          acc.push(menuItem)
        }
        return acc
      }, [])
    },
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
