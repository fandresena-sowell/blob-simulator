import type { UserConfig } from "vite";
export default {
  base: "./", // Base path set to relative for GitHub Pages deployment
  plugins: [], // hint vite that tiled tilesets should be treated as external
  // currently excalibur plugins are commonjs
  // this forces vite to keep things from bundling ESM together with commonjs
  optimizeDeps: {
    exclude: ["excalibur"],
  },
  build: {
    assetsInlineLimit: 0, // excalibur cannot handle inlined xml in prod mode
    sourcemap: true,
    // Vite uses rollup currently for prod builds so a separate config is needed
    // to keep vite from bundling ESM together with commonjs
    rollupOptions: {
      output: {
        format: "umd",
      },
    },
  },
} satisfies UserConfig;
