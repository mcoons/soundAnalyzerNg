///////////////////////////////////////////////////
//   UTILITIES
////////////////////////////////////////////////////

// build full scectrum ROYGBIV palettes [0..1529]
// build single color palettes [0..255]
function buildPalettes(palette, paletteGlow, paletteRed, paletteGreen, paletteBlue, paletteGray, paletteMetallic, scene) {
    let r = 255,
        g = 0,
        b = 0;

    for (let g = 0; g <= 255; g++) {

        // add to full scectrum ROYGBIV palettes [0..1529] - in all loops below
        addToPalette(r, g, b, palette, 1, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, scene);

        // add to single color palettes [0..255] - in this loop only
        addToPalette(g, 0, 0, paletteRed, 1, scene);
        addToPalette(0, g, 0, paletteGreen, 1, scene);
        addToPalette(0, 0, g, paletteBlue, 1, scene);
        addToPalette(g, g, g, paletteGray, 1, scene);
    }
    g--;

    for (r = 254; r >= 0; r--) {
        addToPalette(r, g, b, palette, 1, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, scene);
    }
    r++;

    for (b = 1; b <= 255; b++) {
        addToPalette(r, g, b, palette, 1, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, scene);
    }
    b--;

    for (g = 254; g >= 0; g--) {
        addToPalette(r, g, b, palette, 1, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, scene);
    }
    g++;

    for (r = 1; r <= 255; r++) {
        addToPalette(r, g, b, palette, 1, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, scene);
    }
    r--;

    for (b = 254; b > 0; b--) {
        addToPalette(r, g, b, palette, 1, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, scene);
    }
    b++;
}

// add a palette object to a given palette
function addToPalette(r, g, b, palette, saturation = .6, scene) {

    let mat = new BABYLON.StandardMaterial("material(" + r + "," + g + "," + b + ")", scene);

    r = r * saturation;
    g = g * saturation;
    b = b * saturation;

    var color = new BABYLON.Color4(r / 255, g / 255, b / 255, 1, false);

    mat.diffuseColor = color;
    mat.specularColor = new BABYLON.Color3(r / 255 * .1, g / 255 * .1, b / 255 * .1);
    mat.ambientColor = new BABYLON.Color3(r / 255 * .25, g / 255 * .25, b / 255 * .25);
    mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
    mat.backFaceCulling = false;

    palette.push({
        r,
        g,
        b,
        color,
        mat
    });
}

function addToMetallicPalette(r, g, b, palette, saturation = .6, scene) {

    r = r * saturation;
    g = g * saturation;
    b = b * saturation;

    var color = new BABYLON.Color4(r / 255, g / 255, b / 255, 1, false);

    let mat = new BABYLON.PBRMetallicRoughnessMaterial("mat", scene);

    mat.metallic = 1.0;
    mat.roughness = 1.0;

    palette.push({
        r,
        g,
        b,
        color,
        mat
    });
}

function addToGlowPalette(r, g, b, palette, scene) {

    let dimmer = .8;

    var color = new BABYLON.Color4(r / 255 * dimmer, g / 255 * dimmer, b / 255 * dimmer, 1, false);

    let mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = color;
    mat.specularColor = new BABYLON.Color3(r / 255 * .1, g / 255 * .1, b / 255 * .1);
    mat.ambientColor = new BABYLON.Color3(r / 255 * .25, g / 255 * .25, b / 255 * .25);
    mat.emissiveColor = new BABYLON.Color3(r / 255 * .85, g / 255 * .85, b / 255 * .85);
    mat.backFaceCulling = true;

    palette.push({
        r,
        g,
        b,
        color,
        mat
    });
}

function getBiasedGlowMaterial(colorBias, scene) {

    let dimmer = 1.0;
    let r = Math.random() * colorBias.r;
    let g = Math.random() * colorBias.g;
    let b = Math.random() * colorBias.b;
    let color = new BABYLON.Color4(r * dimmer, g * dimmer, b * dimmer, 1, false);

    let mat = new BABYLON.StandardMaterial("matbiasedGlow", scene);
    mat.diffuseColor = color;
    mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
    mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
    mat.emissiveColor = new BABYLON.Color3(r, g, b);
    
    mat.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
    mat.backFaceCulling = false;

    return mat;
}


// map a value from one range to another
function map(x, oMin, oMax, nMin, nMax) {
    // check range
    if (oMin === oMax) {
        console.log("Map Warning: Zero input range");
        return null;
    }

    if (nMin === nMax) {
        console.log("Map Warning: Zero output range");
        return null;
    }

    // check reversed input range
    let reverseInput = false;
    let oldMin = Math.min(oMin, oMax);
    let oldMax = Math.max(oMin, oMax);

    if (oldMin != oMin) reverseInput = true;

    // check reversed output range
    let reverseOutput = false;
    let newMin = Math.min(nMin, nMax);
    let newMax = Math.max(nMin, nMax);

    if (newMin != nMin) reverseOutput = true;

    // calculate new range
    let portion = (x - oldMin) * (newMax - newMin) / (oldMax - oldMin);
    if (reverseInput) portion = (oldMax - x) * (newMax - newMin) / (oldMax - oldMin);

    let result = portion + newMin;
    if (reverseOutput) result = newMax - portion;

    return result;
}

// log text to the console overlay DIV
function logToScreen(htmlToRender) {
    document.getElementById("consoleElement").innerHTML = htmlToRender;
}

function colors(yy) {
    let r;
    let g;
    let b;
    
    const colorSets = [
        {
            r: 128 - yy / 2,
            g: yy,
            b: 200 - yy * 2
        },
        {
            r: yy,
            g: 128 - yy / 2,
            b: 200 - yy * 2
        },
        {
            r: 128 - yy / 2,
            g: 200 - yy * 2,
            b: yy
        },
        {
            r: 200 - yy * 2,
            g: yy,
            b: 128 - yy / 2
        },
        {
            r: yy,
            g: 200 - yy * 2,
            b: 128 - yy / 2
        },
        {
            r: 200 - yy * 2,
            g: 128 - yy / 2,
            b: yy
        },
        {
            r: 255 - (128 - yy / 2),
            g: 255 - yy,
            b: 255 - (200 - yy * 2)
        },
        {
            r: 255 - yy,
            g: 255 - (128 - yy / 2),
            b: 255 - (200 - yy * 2)
        },
        {
            r: 255 - (128 - yy / 2),
            g: 255 - (200 - yy * 2),
            b: 255 - yy
        },
        {
            r: 255 - (200 - yy * 2),
            g: 255 - yy,
            b: 255 - (128 - yy / 2)
        },
        {
            r: 255 - yy,
            g: 255 - (200 - yy * 2),
            b: 255 - (128 - yy / 2)
        },
        {
            r: 255 - (200 - yy * 2),
            g: 255 - (128 - yy / 2),
            b: 255 - yy
        }
    ];

    let getOptionColor = (name, c) => {
        let val = this.optionsService[name];

        if (c === 'r') {
            return(val.substring(1, 3));
        }

        if (c === 'g') {
            return(val.substring(3, 5));
        }

        if (c === 'b') {
            return(val.substring(5));
        }

        // return val;
    };

    if (this.optionsService.customColors === true) {
        // tslint:disable-next-line: max-line-length
        r = colorSets[this.startingColorSet].r + (colorSets[this.endingColorSet].r - colorSets[this.startingColorSet].r) * this.colorTime;
        // tslint:disable-next-line: max-line-length
        g = colorSets[this.startingColorSet].g + (colorSets[this.endingColorSet].g - colorSets[this.startingColorSet].g) * this.colorTime;
        // tslint:disable-next-line: max-line-length
        b = colorSets[this.startingColorSet].b + (colorSets[this.endingColorSet].b - colorSets[this.startingColorSet].b) * this.colorTime;
    } else {

        // tslint:disable-next-line: max-line-length
        r = parseInt( getOptionColor('minColor', 'r'), 16) + (parseInt( getOptionColor('maxColor', 'r'), 16) - parseInt( getOptionColor('minColor', 'r'), 16)) * yy/255;
        // tslint:disable-next-line: max-line-length
        g = parseInt( getOptionColor('minColor', 'g'), 16) + (parseInt( getOptionColor('maxColor', 'g'), 16) - parseInt( getOptionColor('minColor', 'g'), 16)) * yy/255;
        // tslint:disable-next-line: max-line-length
        b = parseInt( getOptionColor('minColor', 'b'), 16) + (parseInt( getOptionColor('maxColor', 'b'), 16) - parseInt( getOptionColor('minColor', 'b'), 16)) * yy/255;
        // console.log('test');
        // console.log(parseInt( getOptionColor('minColor', 'g'), 16));
    }
    return { r, g, b };
}

function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;

    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    s /= 100;
    v /= 100;

    if(s == 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
    return {r: r, g: g, b: b};
}


export {
    // addToGlowPalette,
    // addToPalette,
    colors,
    buildPalettes,
    getBiasedGlowMaterial,
    map,
    logToScreen
};