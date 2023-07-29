import { fetchPlugin } from "@/bundler/plugins/fetch-plugin";
import { unpkgPathPlugin } from "@/bundler/plugins/unpkg-path-plugin";
import * as esbuild from "esbuild-wasm";

let esBuildInitialized = false;

export const bundle = async (rawCode: string) => {
  if (!esBuildInitialized) {
    await esbuild.initialize({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.18.14/esbuild.wasm",
    });
    esBuildInitialized = true;
  }

  try {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        global: "window",
      },
    });
    return { code: result.outputFiles[0].text, error: "" };
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message, code: "" };
    }
    return { error: "Unknown error", code: "" };
  }
};
