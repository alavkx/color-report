const dir = require("node-dir");
const U = require("./util");
const web = require("./web");
const OUTPUT_LOCATION = "dist";

const exec = (inputDir = __dirname, outputPath = OUTPUT_LOCATION) => {
    let fileContent = [];
    dir.readFiles(inputDir,
        { match: /.css$/, exclude: ["node_modules"] },
        (err, content, next) => {
            if (err) { throw err; }
            fileContent.push(content);
            next();
        },
        (err, files) => { // Done
            if (err) { throw err; }
            U.writeTo(
                outputPath,
                web.toHtml(U.colorPalette(fileContent)));
        });
};

exec(process.argv[2], process.argv[3]); 