const R = require("ramda");

const hexToHue = (hex) => {
    hex = hex.replace(/[^0-9A-F]/gi, "");
    const bigint = parseInt(hex, 16),
        r = (bigint >> 16) & 255,
        g = (bigint >> 8) & 255,
        b = bigint & 255;

    return r + g + b;
};

const colorElement = x => `<span class="color" title="${x}" style="background-color: ${x};" onclick=copyToClipboard('${x}')></span>`;

const webpage = x => `<html>
    <script>
        window.copyToClipboard = function (text) {
            var temp = document.createElement("input");
            temp.innerHTML = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            temp.remove();
        }
    </script>
    <style>
        body {
            margin: 0 auto;
            max-width: 920px;
            background-color: whitesmoke;
            text-align: center;
        }
        .color {
            border: 1px solid whitesmoke;
            width: 40px;
            height: 40px;
            cursor:pointer;
        }
        .colors {
            display:flex;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        .text { 
            height: 300px;
            width: 100%;
        }
    </style>
    <body>
        <h1>Application Color Palette</h1>
        <div class="colors">${elements(x)}</div>
        <textarea class="text">${x}</textarea>
    </body></html>`;

const elements = R.pipe(R.map(colorElement), R.join(""));
const toHtml = R.pipe(R.sortBy(hexToHue), webpage);

module.exports = { toHtml };
