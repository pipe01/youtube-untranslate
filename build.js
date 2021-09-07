const esbuild = require("esbuild");
const JSZip = require("jszip");
const path = require("path");
const fs = require("fs");

const watch = process.argv.includes("--watch");
const includeFiles = ["manifest.json", "icons/48x48.png", "icons/96x96.png"];

try {
    fs.mkdirSync("artifacts");
} catch (e) {}

const version = JSON.parse(fs.readFileSync("manifest.json")).version;

esbuild.build({
    entryPoints: ["src/content.ts"],
    outfile: "dist/content.js",
    bundle: true,
    format: "cjs",
    watch,
    minify: !watch,
    metafile: true,
    write: watch
})
.then(o => {
    if (!watch) {
        const zip = new JSZip();

        o.outputFiles.forEach(file => zip.file("dist/" + path.basename(file.path), file.contents));

        includeFiles.forEach(o => zip.file(o, fs.readFileSync(o)));

        zip.generateAsync({type: "arraybuffer"}).then(o => {
            fs.writeFileSync(`artifacts/extension-${version}.zip`, Buffer.from(o));
        })
    }
})