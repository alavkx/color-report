const R = require("ramda");
const fs = require("fs");
const path = require("path");
const css = require("css");

const DEFAULT_FILENAME = "/color-palette.html";
const writeTo = (outputPath, data) => fs.writeFile(outputPath + DEFAULT_FILENAME, data, err => {
    if (err) { throw err; }
    console.log(`Color report saved to '${outputPath}'`);
});

const expandHex = ([pound, r, g, b]) => pound + r + r + g + g + b + b;
const isShorthand = R.pipe(R.length, R.equals(4));

const homogenizeHex = R.compose(
    R.when(isShorthand, expandHex),
    R.toUpper,
    R.trim);

const isolateHex = R.compose(
    R.reject(R.anyPass([
        R.isEmpty,
        R.contains("("),
        R.contains(")"),
        R.contains("-"),
        R.contains("="),
        R.contains(",")])),
    R.chain(R.pipe(R.split("!"), R.head)),  // Remove !important
    R.filter(R.contains("#")),              // Take only hex values
    R.chain(R.split(" ")),                  // Break up short-hand values
    R.reject(R.isNil));

const stylesFromAST = R.compose(
    R.map(R.prop("value")),
    R.chain(R.prop("declarations")),
    R.path(["stylesheet", "rules"]),
    css.parse);

const colorPalette = R.compose(
    R.uniq,
    R.map(homogenizeHex), 
    isolateHex,
    stylesFromAST,
    R.join(""));

module.exports = { colorPalette, writeTo };