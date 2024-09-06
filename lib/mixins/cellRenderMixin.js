const cellRenderMixin = {
  mounted() {
    if (
      this.params.context &&
      this.params.context.componentParent &&
      this.params.context.componentParent.$vuetify
    ) {
      this.$vuetify = this.params.context.componentParent.$vuetify
    } else {
      // eslint-disable-next-line
      console.error(
        `There is no valid vuetify instance found, please initialize vuetify in your application before using this library.`
      )
    }
  },
}

export default cellRenderMixin
