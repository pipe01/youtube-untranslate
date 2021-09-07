const esbuild = require("esbuild");
const JSZip = require("jszip");
const path = require("path");
const fs = require("fs");

const watch = process.argv.includes("--watch");

try {
    fs.mkdirSync("artifacts");
} catch (e) {}

const version = JSON.parse(fs.readFileSync("manifest.json")).version;

esbuild.build({
    entryPoints: ["src/content.ts"],
    outfile: "content.js",
    bundle: true,
    format: "cjs",
    watch,
    minify: !watch,
    metafile: true,
    write: false
})
.then(o => {
    if (!watch) {
        const zip = new JSZip();

        o.outputFiles.forEach(file => zip.file("dist/" + path.basename(file.path), file.contents));
        zip.file("manifest.json", fs.readFileSync("manifest.json"));

        zip.generateAsync({type: "arraybuffer"}).then(o => {
            fs.writeFileSync(`artifacts/extension-${version}.zip`, Buffer.from(o));
        })
    }
})