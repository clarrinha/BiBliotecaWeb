import { defineConfig } from "vite";

// Minimal Vite config to serve plain static HTML/CSS/JS pages.
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        livros: "livros.html",
        autores: "autores.html",
        membros: "membros.html",
        emprestimos: "emprestimos.html",
        categorias: "categorias.html",
        sobre: "sobre.html",
      },
    },
  },
});
