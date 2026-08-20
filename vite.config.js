import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";

function excludeUnusedFrameSources() {
  return {
    name: "exclude-unused-frame-sources",
    apply: "build",
    async closeBundle() {
      const framesDirectory = path.resolve("dist/images/frames");
      const directories = await readdir(framesDirectory, { withFileTypes: true });

      await Promise.all(directories
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const directory = path.join(framesDirectory, entry.name);
          const files = await readdir(directory, { withFileTypes: true });
          await Promise.all(files
            .filter((file) => file.isFile() && /\.(?:jpe?g|png)$/i.test(file.name))
            .map((file) => unlink(path.join(directory, file.name))));
        }));
      await unlink(path.resolve("dist/images/igor-santos-logo.png")).catch(() => {});
      const transformationsDirectory = path.resolve("dist/images/transformations");
      const transformations = await readdir(transformationsDirectory, { withFileTypes: true });
      await Promise.all(transformations
        .filter((file) => file.isFile() && /\.jpe?g$/i.test(file.name))
        .map((file) => unlink(path.join(transformationsDirectory, file.name))));
    },
  };
}

export default defineConfig({
  plugins: [react(), excludeUnusedFrameSources()],
  base: "./",
});
