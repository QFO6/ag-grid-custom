<template>
  <div>
    <v-row
      justify="center"
      align="center"
    >
      <v-col cols="12">
        <img
          alt="Vue logo"
          src="@/assets/vue_logo.png"
        >
      </v-col>
      <v-col cols="12">
        <h1>Welcome to Ag-Grid Cutom Demo App</h1>
      </v-col>
      <v-col cols="12">
        <nav>
          <template v-for="(item, index) in rootItems">
            <router-link
              :key="item.name"
              :to="item"
            >
              {{ item.title }}
            </router-link>
            <span
              v-if="index < rootItems.length - 1"
              :key="`${index}_${item.name}`"
            >
              &nbsp;&nbsp;|&nbsp;&nbsp;
            </span>
          </template>
        </nav>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { routes } from '@/router'
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      rootItems: routes
        .filter((item) => item.name != 'Home')
        .map((item) => {
          let title = item.name
          if (item.meta && item.meta.title) {
            title = item.meta.title
          }
          return {
            name: item.name,
            title: title,
          }
        }),
    }
  },
  computed: {},
}
</script>
