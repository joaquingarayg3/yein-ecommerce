import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "detalle-producto": resolve(
          __dirname,
          "src/pages/detalle-producto/index.html",
        ),
        checkout: resolve(__dirname, "src/pages/checkout/index.html"),
      },
    },
  },
});
