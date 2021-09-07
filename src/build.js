const esbuild = require("esbuild");

const watch = process.argv.includes("--watch");

esbuild.build({
    entryPoints: ["content.ts"],
    outfile: "../dist/content.js",
    bundle: true,
    format: "cjs",
    watch,
    minify: !watch
})