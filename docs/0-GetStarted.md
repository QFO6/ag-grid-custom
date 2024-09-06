# Get Started with Ag-Grid-Custom

## Add AG Grid Custom to JS Project

For the JS projects which do not support AMD (Asynchronous Module Definition) or CommonJS, use the UMD (Universal Module Definition) bundle, since the UMD format allows JavaScript modules to be imported using CommonJS, AMD as well as script.

1. Copythe following scripts and styles from the [dist folder] and add them to the `<head>`:

   ```vue
   <head>    
     <script src="/public/lib/ag-grid-custom/ag-grid-custom.umd.min.js"></script>    
     <link rel="stylesheet" href="/public/lib/ag-grid-custom/ag-grid-custom.css">    
   </head>
   ```

2. Register the Vue components (globally) before you can use it:

   `AgCustom` is the library name bounded with all the exports. A full list of ag-grid-custom UI components is available at [here].

   ```vue
   Vue.component('v-server-paginated-ag-table',
   AgCustom.VServerPaginatedAgTable)
   ```

   Now you are ready to use the `v-server-paginated-ag-table` component in your project.
