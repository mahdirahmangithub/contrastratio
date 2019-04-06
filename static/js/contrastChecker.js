
function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b, alpha];
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function setPreview(id, hex, alpha) {
    $(id).children(".colorPreviewWrapper").children(".colorPreviewContainer").children(".colorPreview").css("background-color", "#" + hex);
    $(id).children(".colorPreviewWrapper").children(".colorPreviewContainer").children(".colorPreview").css("opacity", alpha);
}

function setBackPreview(id, hex) {
    $(id).children(".colorPreviewWrapper").children(".colorPreviewContainer").children(".colorPreview").css("background-color", "#" + hex);
}

function calculateFinalColor(tR, tG, tB, tA, bR, bG, bB) {
    fR = Math.round((tR * tA) + (bR * (1 - tA))),
        fG = Math.round((tG * tA) + (bG * (1 - tA))),
        fB = Math.round((tB * tA) + (bB * (1 - tA)));
    return [fR, fG, fB];
}

function luminanace(r, g, b) {
    var a = [r, g, b].map((v) => {
        v /= 255;
        return (v <= 0.03928) ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(fl, bl) {
    result = (fl + 0.05) / (bl + 0.05);
    return (result < 1) ? 1 / result : result;
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    var r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function setCell(cellId, fR, fG, fB, bR, bG, bB, cR, bHex, fHex, l) {
    $(cellId).removeClass('changed');
    var textColor = 'rgb(' + fR + ',' + fG + ',' + fB + ')',
        backColor = 'rgb(' + bR + ',' + bG + ',' + bB + ')';
    $(cellId).children(".backgroundColorContainer").css("background-color", backColor);
    $(cellId).children(".backgroundColorContainer").children(".foregroundText").css("color", textColor);
    $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children(".textInfoContainer").children(".textInfo")[0].innerHTML = fHex;
    $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children(".backInfoContainer").children(".backInfo")[0].innerHTML = bHex;
    if (Math.ceil(l / 10) == l / 10) {
        $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children(".brightnessSliderContainer").children('input')[0].max = 100;
        $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children(".brightnessSliderContainer").children('input')[0].min = 0;
    } else {
        $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children(".brightnessSliderContainer").children('input')[0].max = 100 + (10 - ((Math.ceil(l / 10) * 10) - l));
        $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children(".brightnessSliderContainer").children('input')[0].min = 10 - ((Math.ceil(l / 10) * 10) - l);
    }
    $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children(".brightnessSliderContainer").children('input')[0].value = l;
    $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children(".brightnessSliderContainer").children('input')[0].step = "10";
    $(cellId).children(".resultWrapper").children(".paletteInfoContainer").children('.brightnessSliderContainer').children('.rangeTooltipWrapper').children('.rangeTooltipContainer')[0].innerHTML = Math.round(l);
    var slider = $(cellId)
        .children(".resultWrapper")
        .children(".paletteInfoContainer")
        .children(".brightnessSliderContainer")
        .children("input")[0],
        sliderPos = (slider.value - slider.min) / (slider.max - slider.min);
    thumbPostion = slider.clientWidth * sliderPos;
    if (thumbPostion < 1) {
        $(cellId)
            .children(".resultWrapper")
            .children(".paletteInfoContainer")
            .children(".brightnessSliderContainer")
            .children(".rangeTooltipWrapper")
            .children(".rangeTooltipContainer")
            .css("left", thumbPostion - 9 + "px");
    } else if (thumbPostion < 50) {
        $(cellId)
            .children(".resultWrapper")
            .children(".paletteInfoContainer")
            .children(".brightnessSliderContainer")
            .children(".rangeTooltipWrapper")
            .children(".rangeTooltipContainer")
            .css("left", thumbPostion - 11.5 + "px");
    } else if (thumbPostion >= 50 && thumbPostion <= 99) {
        $(cellId)
            .children(".resultWrapper")
            .children(".paletteInfoContainer")
            .children(".brightnessSliderContainer")
            .children(".rangeTooltipWrapper")
            .children(".rangeTooltipContainer")
            .css("left", thumbPostion - 14 + "px");
    }
    else if (thumbPostion > 99) {
        $(cellId)
            .children(".resultWrapper")
            .children(".paletteInfoContainer")
            .children(".brightnessSliderContainer")
            .children(".rangeTooltipWrapper")
            .children(".rangeTooltipContainer")
            .css("left", thumbPostion - 19 + "px");
    }

    if (cR >= 7.5) {
        $(cellId).removeClass("failed AA AA18 DNP").addClass("checked AAA");
        $(cellId).children(".resultWrapper").children(".resultContainer").children(".resultRatio")[0].innerHTML = cR;

    } else if (cR >= 4.5 && cR < 7.5) {
        $(cellId).removeClass("failed AAA AA18 DNP").addClass("checked AA");
        $(cellId).children(".resultWrapper").children(".resultContainer").children(".resultRatio")[0].innerHTML = cR;

    } else if (cR >= 3 && cR < 4.5) {
        $(cellId).removeClass("failed AAA AA DNP").addClass("checked AA18");
        $(cellId).children(".resultWrapper").children(".resultContainer").children(".resultRatio")[0].innerHTML = cR;

    } else if (cR < 3) {
        $(cellId).removeClass("checked AAA AA AA18").addClass("failed DNP");
        $(cellId).children(".resultWrapper").children(".resultContainer").children(".resultRatio")[0].innerHTML = cR;
    }
}
// Expand Box
$(document).ready(function (e) {
    $("body").on('click', '.paletteTableCell', function (event) {
        $(".paletteTableCell").removeClass('active').addClass('deactive');
        $(this).removeClass('deactive').addClass('active');
        event.stopPropagation();
    });

    $(document).click(function (event) {
        if (!$(event.target).hasClass('paletteTableCell')) {
            $(".paletteTableCell").removeClass('active deactive');
        }
    });
});

// input function
var globefRCont = [], globefGCont = [], globefBCont = [];

$("body").on('keydown', ".textColor", function () {
    var j = $(this).parents(".colorInputContainer")[0].id.match(/\d/g)[0];
    tColor = document.getElementById('t' + [j]).getElementsByClassName("colorHexInput")[0].value;
    if (document.getElementById('t' + [j]).getElementsByClassName("colorAlphaInput")[0].value >= 100) {
        tAlpha = 1;
    } else {
        tAlpha = document.getElementById('t' + [j]).getElementsByClassName("colorAlphaInput")[0].value / 100
    };
    setPreview('#t' + [j], tColor, tAlpha);

    var globefR = [], globefG = [], globefB = [];

    var backFieldLength = $(".backColor").length + 1;

    for (var i = 1; i < backFieldLength; ++i) {
        var tR = hexToRgba(tColor, tAlpha)[0],
            tG = hexToRgba(tColor, tAlpha)[1],
            tB = hexToRgba(tColor, tAlpha)[2],
            tA = hexToRgba(tColor, tAlpha)[3],
            bR = hexToRgba(document.getElementById('b' + [i]).getElementsByClassName("colorHexInput")[0].value, 1)[0],
            bG = hexToRgba(document.getElementById('b' + [i]).getElementsByClassName("colorHexInput")[0].value, 1)[1],
            bB = hexToRgba(document.getElementById('b' + [i]).getElementsByClassName("colorHexInput")[0].value, 1)[2],
            fR = calculateFinalColor(tR, tG, tB, tA, bR, bG, bB)[0],
            fG = calculateFinalColor(tR, tG, tB, tA, bR, bG, bB)[1],
            fB = calculateFinalColor(tR, tG, tB, tA, bR, bG, bB)[2],
            fl = luminanace(fR, fG, fB),
            bl = luminanace(bR, bG, bB),
            cR = contrastRatio(fl, bl).toFixed(2),
            l = rgbToHsl(fR, fG, fB)[2],
            fHex = rgbToHex(fR, fG, fB);
        globefR[i - 1] = fR;
        globefG[i - 1] = fG;
        globefB[i - 1] = fB;

        setCell('#t' + [j] + 'b' + [i], fR, fG, fB, bR, bG, bB, cR, document.getElementById('b' + [i]).getElementsByClassName("colorHexInput")[0].value, fHex, l);
    }
    globefRCont.splice((j - 1) * 4, globefR.length, ...globefR);
    globefGCont.splice((j - 1) * 4, globefG.length, ...globefG);
    globefBCont.splice((j - 1) * 4, globefB.length, ...globefB);
});

// palette mouseover
$("body").on('mouseover', '.paletteTableCell', function () {
    var j = $(this)[0].id.match(/\d/g)[0];
    var i = $(this)[0].id.match(/\d/g)[1];
    $('#t' + [j]).children('.fieldIndicator').addClass('active');
    $('#b' + [i]).children('.fieldIndicator').addClass('active');
});

$("body").on('mouseout', '.paletteTableCell', function () {
    var j = $(this)[0].id.match(/\d/g)[0];
    var i = $(this)[0].id.match(/\d/g)[1];
    $('#t' + [j]).children('.fieldIndicator').removeClass('active');
    $('#b' + [i]).children('.fieldIndicator').removeClass('active');
});

// Change Lightness
$("body").on('input', 'input[type="range"]', function () {
    var j = $(this).parents(".paletteTableCell")[0].id.match(/\d/g)[0];
    var i = $(this).parents(".paletteTableCell")[0].id.match(/\d/g)[1];
    var newL = $(this)[0].value,
        beforeShadeR = globefRCont[((j - 1) * 4) + (i - 1)],
        beforeShadeG = globefGCont[((j - 1) * 4) + (i - 1)],
        beforeShadeB = globefBCont[((j - 1) * 4) + (i - 1)],
        beforeShadeL = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[2],
        firstChangeAmount = parseFloat(beforeShadeL).toFixed(0),
        newChangeAmount = parseFloat(newL).toFixed(0);
    if (firstChangeAmount != newChangeAmount) {
        $(this).parents(".paletteTableCell").addClass('changed');
    } else {
        $(this).parents(".paletteTableCell").removeClass('changed');
    };

    if (newL >= 1 && newL <= 99) {
        var beforeShadeR = globefRCont[((j - 1) * 4) + (i - 1)],
            beforeShadeG = globefGCont[((j - 1) * 4) + (i - 1)],
            beforeShadeB = globefBCont[((j - 1) * 4) + (i - 1)],
            beforeShadeH = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[0],
            beforeShadeS = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[1],
            beforeShadeL = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[2],
            afterShadeH = beforeShadeH,
            afterShadeS = beforeShadeS,
            afterShadeL = newL,
            afterShadeHSL = 'hsl(' + afterShadeH + ',' + afterShadeS + '%,' + afterShadeL + '%)',
            afterShadeR = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[0],
            afterShadeG = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[1],
            afterShadeB = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[2],
            afterShadeRGB = 'rgb(' + afterShadeR + ',' + afterShadeG + ',' + afterShadeB + ')',
            afterShadeHex = hslToHex(afterShadeH, afterShadeS, afterShadeL),
            afterShadeLum = luminanace(afterShadeR, afterShadeG, afterShadeB),
            shaderBackRGB = $(this).parents('.paletteTableCell').children('.backgroundColorContainer').css("background-color"),
            shaderBackR = shaderBackRGB.match(/\d+/g)[0],
            shaderBackG = shaderBackRGB.match(/\d+/g)[1],
            shaderBackB = shaderBackRGB.match(/\d+/g)[2],
            shaderBackL = luminanace(shaderBackR, shaderBackG, shaderBackB),
            sfterShadeCR = contrastRatio(afterShadeLum, shaderBackL).toFixed(2);


        $(this).parents('.paletteTableCell').children('.backgroundColorContainer').children('.foregroundText').css("color", afterShadeHSL);
        $(this).parents('.paletteInfoContainer').children('.textInfoContainer').children('.textInfo')[0].innerHTML = afterShadeHex;
    }

    else if (newL < 1) {
        newL = 0;
        var beforeShadeR = globefRCont[((j - 1) * 4) + (i - 1)],
            beforeShadeG = globefGCont[((j - 1) * 4) + (i - 1)],
            beforeShadeB = globefBCont[((j - 1) * 4) + (i - 1)],
            beforeShadeH = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[0],
            beforeShadeS = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[1],
            beforeShadeL = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[2],
            afterShadeH = beforeShadeH,
            afterShadeS = beforeShadeS,
            afterShadeL = newL,
            afterShadeHSL = 'hsl(' + afterShadeH + ',' + afterShadeS + '%,' + afterShadeL + '%)',
            afterShadeR = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[0],
            afterShadeG = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[1],
            afterShadeB = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[2],
            afterShadeRGB = 'rgb(' + afterShadeR + ',' + afterShadeG + ',' + afterShadeB + ')',
            afterShadeHex = hslToHex(afterShadeH, afterShadeS, afterShadeL),
            afterShadeLum = luminanace(afterShadeR, afterShadeG, afterShadeB),
            shaderBackRGB = $(this).parents('.paletteTableCell').children('.backgroundColorContainer').css("background-color"),
            shaderBackR = shaderBackRGB.match(/\d+/g)[0],
            shaderBackG = shaderBackRGB.match(/\d+/g)[1],
            shaderBackB = shaderBackRGB.match(/\d+/g)[2],
            shaderBackL = luminanace(shaderBackR, shaderBackG, shaderBackB),
            sfterShadeCR = contrastRatio(afterShadeLum, shaderBackL).toFixed(2);

        $(this).parents('.paletteTableCell').children('.backgroundColorContainer').children('.foregroundText').css("color", afterShadeHSL);
        $(this).parents('.paletteInfoContainer').children('.textInfoContainer').children('.textInfo')[0].innerHTML = afterShadeHex;
    } else if (newL > 99) {
        newL = 100;
        var beforeShadeR = globefRCont[((j - 1) * 4) + (i - 1)],
            beforeShadeG = globefGCont[((j - 1) * 4) + (i - 1)],
            beforeShadeB = globefBCont[((j - 1) * 4) + (i - 1)],
            beforeShadeH = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[0],
            beforeShadeS = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[1],
            beforeShadeL = rgbToHsl(beforeShadeR, beforeShadeG, beforeShadeB)[2],
            afterShadeH = beforeShadeH,
            afterShadeS = beforeShadeS,
            afterShadeL = newL,
            afterShadeHSL = 'hsl(' + afterShadeH + ',' + afterShadeS + '%,' + afterShadeL + '%)',
            afterShadeR = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[0],
            afterShadeG = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[1],
            afterShadeB = hslToRgb(afterShadeH, afterShadeS, afterShadeL)[2],
            afterShadeRGB = 'rgb(' + afterShadeR + ',' + afterShadeG + ',' + afterShadeB + ')',
            afterShadeHex = hslToHex(afterShadeH, afterShadeS, afterShadeL),
            afterShadeLum = luminanace(afterShadeR, afterShadeG, afterShadeB),
            shaderBackRGB = $(this).parents('.paletteTableCell').children('.backgroundColorContainer').css("background-color"),
            shaderBackR = shaderBackRGB.match(/\d+/g)[0],
            shaderBackG = shaderBackRGB.match(/\d+/g)[1],
            shaderBackB = shaderBackRGB.match(/\d+/g)[2],
            shaderBackL = luminanace(shaderBackR, shaderBackG, shaderBackB),
            sfterShadeCR = contrastRatio(afterShadeLum, shaderBackL).toFixed(2);

        $(this).parents('.paletteTableCell').children('.backgroundColorContainer').children('.foregroundText').css("color", afterShadeHSL);
        $(this).parents('.paletteInfoContainer').children('.textInfoContainer').children('.textInfo')[0].innerHTML = afterShadeHex;
    }


    var slider = $(this)[0],
        sliderPos = (slider.value - slider.min) / (slider.max - slider.min);
    thumbPostion = slider.clientWidth * sliderPos;



    if (thumbPostion < 1) {
        $(this)
            .parents(".paletteInfoContainer")
            .children(".brightnessSliderContainer")
            .children(".rangeTooltipWrapper")
            .children(".rangeTooltipContainer")
            .css("left", thumbPostion - 9 + "px");
    } else if (thumbPostion < 50) {
        $(this)
            .parents(".paletteInfoContainer")
            .children(".brightnessSliderContainer")
            .children(".rangeTooltipWrapper")
            .children(".rangeTooltipContainer")
            .css("left", thumbPostion - 11.5 + "px");
    } else if (thumbPostion >= 50 && thumbPostion <= 99) {
        $(this)
            .parents(".paletteInfoContainer")
            .children(".brightnessSliderContainer")
            .children(".rangeTooltipWrapper")
            .children(".rangeTooltipContainer")
            .css("left", thumbPostion - 14 + "px");
    }

    else if (thumbPostion > 99) {
        $(this)
            .parents(".paletteInfoContainer")
            .children(".brightnessSliderContainer")
            .children(".rangeTooltipWrapper")
            .children(".rangeTooltipContainer")
            .css("left", thumbPostion - 19 + "px");
    }


    if (slider.value < 1) {
        $(this).parents('.paletteInfoContainer').children('.brightnessSliderContainer').children('.rangeTooltipWrapper').children('.rangeTooltipContainer')[0].innerHTML = "0";

    } else if (slider.value > 1 && slider.value <= 99) {
        $(this).parents('.paletteInfoContainer').children('.brightnessSliderContainer').children('.rangeTooltipWrapper').children('.rangeTooltipContainer')[0].innerHTML = Math.round(slider.value);

    } else if (slider.value > 99) {
        $(this).parents('.paletteInfoContainer').children('.brightnessSliderContainer').children('.rangeTooltipWrapper').children('.rangeTooltipContainer')[0].innerHTML = "100";

    }




    if (sfterShadeCR >= 7.5) {
        $(this).parents('.paletteTableCell').removeClass("failed AA AA18 DNP").addClass("checked AAA");
        $(this).parents('.paletteTableCell').children(".resultWrapper").children(".resultContainer").children(".resultRatio")[0].innerHTML = sfterShadeCR;

    } else if (sfterShadeCR >= 4.5 && sfterShadeCR < 7.5) {
        $(this).parents('.paletteTableCell').removeClass("failed AAA AA18 DNP").addClass("checked AA");
        $(this).parents('.paletteTableCell').children(".resultWrapper").children(".resultContainer").children(".resultRatio")[0].innerHTML = sfterShadeCR;

    } else if (sfterShadeCR >= 3 && sfterShadeCR < 4.5) {
        $(this).parents('.paletteTableCell').removeClass("failed AAA AA DNP").addClass("checked AA18");
        $(this).parents('.paletteTableCell').children(".resultWrapper").children(".resultContainer").children(".resultRatio")[0].innerHTML = sfterShadeCR;

    } else if (sfterShadeCR < 3) {
        $(this).parents('.paletteTableCell').removeClass("checked AAA AA AA18").addClass("failed DNP");
        $(this).parents('.paletteTableCell').children(".resultWrapper").children(".resultContainer").children(".resultRatio")[0].innerHTML = sfterShadeCR;
    }
});

//Change Opacity
$("body").on('keydown', '.colorAlphaInput', function () {
    $(this).parents('.colorInputContainer').children('.colorHexInput').keydown();
});

// Back Color Change
$("body").on('keydown', '.backColor', function () {
    var i = $(this).parents('.colorInputContainer')[0].id.match(/\d/g)[0];
    setBackPreview('#b' + [i], $(this)[0].value);
    var cellCount = $('.paletteTableWrapper').children('.paletteTableRow').length + 1;
    for (var j = 1; j < cellCount; ++j) {
        $("#t" + [j]).children(".colorHexInput").keydown();
    }
});

// Add New Text Color
$(".addTextColorField").click(function () {
    var colorCount = $(this).parents(".leftPanelContainer").children(".textColorContainer").children(".colorInputContainer").length + 1,
        newColorField = '<div id="t' + colorCount + '" class="colorInputContainer textColorField"> <div class="fieldIndicator bgRed"></div><div class="colorPreviewWrapper">    <div class="colorPreviewContainer"><div class="colorPreview"></div></div></div><input class="colorHexInput clrBlack87 textColor"><input class="colorAlphaInput clrBlack87" type="number" min="0" max="100" value="100"><div class="removeFieldContainer "><div class="removeField bgRed"></div></div></div> ',
        newPaletteRow = '<div id="row' + colorCount + '" class="paletteTableRow"></div>';
    $(".textColorContainer").append(newColorField);
    $(".paletteTableWrapper").append(newPaletteRow);
    var backFieldLength = $(".backColor").length + 1;
    for (var i = 1; i < backFieldLength; ++i) {
        var newCellRow = ' <div id="t' + colorCount + 'b' + [i] + '" class="paletteTableCell"> <div class="backgroundColorContainer"> <span class="foregroundText">Aa</span> </div> <div class="resultWrapper "> <div class="resultContainer"> <div class="resultIcon"></div> <div class="resultTypeContainer clrWhite"> <span class="resultTypeAAA">AAA</span> <span class="resultTypeAA">AA</span> <span class="resultTypeAA18">AA18</span> <span class="resultTypeDNP">DNP</span> </div> <span class="resultRatio clrWhite"> </span> </div> <div class="paletteInfoContainer" data-html2canvas-ignore> <div class="brightnessSliderContainer"><div class="rangeTooltipWrapper"><div class="rangeTooltipContainer"></div></div><input type="range" name="lightness"> </div> <div class="textInfoContainer clrWhite"> <span class="textInfoTitle">Text color</span> <span class="textInfo"> </span> </div> <div class="backInfoContainer clrWhite"> <span class="backInfoTitle">Background color</span> <span class="backInfo"></span> </div> </div> </div> <div class="saveBtnContainer bgBlue clrWhite" data-html2canvas-ignore>Save</div>  <div class="resetBtnContainer bgRed clrWhite" data-html2canvas-ignore>Reset</div> </div>',
            bR = hexToRgba(document.getElementById('b' + [i]).getElementsByClassName("colorHexInput")[0].value, 1)[0],
            bG = hexToRgba(document.getElementById('b' + [i]).getElementsByClassName("colorHexInput")[0].value, 1)[1],
            bB = hexToRgba(document.getElementById('b' + [i]).getElementsByClassName("colorHexInput")[0].value, 1)[2],
            backColor = 'rgb(' + bR + ',' + bG + ',' + bB + ')';
        $('#row' + colorCount).append(newCellRow);
        $('#t' + colorCount + 'b' + [i]).children(".backgroundColorContainer").css("background-color", backColor);
    }
});

// Reset Cell
$("body").on('click', '.resetBtnContainer', function () {
    var i = $(this).parents('.paletteTableCell')[0].id.match(/\d/g)[0],
        j = $(this).parents('.paletteTableCell')[0].id.match(/\d/g)[1];
    tColor = document.getElementById('t' + [i]).getElementsByClassName("colorHexInput")[0].value;
    if (document.getElementById('t' + [i]).getElementsByClassName("colorAlphaInput")[0].value >= 100) {
        tAlpha = 1;
    } else {
        tAlpha = document.getElementById('t' + [i]).getElementsByClassName("colorAlphaInput")[0].value / 100
    };

    var tR = hexToRgba(tColor, tAlpha)[0],
        tG = hexToRgba(tColor, tAlpha)[1],
        tB = hexToRgba(tColor, tAlpha)[2],
        tA = hexToRgba(tColor, tAlpha)[3],
        bR = hexToRgba(document.getElementById('b' + [j]).getElementsByClassName("colorHexInput")[0].value, 1)[0],
        bG = hexToRgba(document.getElementById('b' + [j]).getElementsByClassName("colorHexInput")[0].value, 1)[1],
        bB = hexToRgba(document.getElementById('b' + [j]).getElementsByClassName("colorHexInput")[0].value, 1)[2],
        fR = calculateFinalColor(tR, tG, tB, tA, bR, bG, bB)[0],
        fG = calculateFinalColor(tR, tG, tB, tA, bR, bG, bB)[1],
        fB = calculateFinalColor(tR, tG, tB, tA, bR, bG, bB)[2],
        fl = luminanace(fR, fG, fB),
        bl = luminanace(bR, bG, bB),
        cR = contrastRatio(fl, bl).toFixed(2),
        l = rgbToHsl(fR, fG, fB)[2],
        fHex = rgbToHex(fR, fG, fB);
    setCell('#t' + [i] + 'b' + [j], fR, fG, fB, bR, bG, bB, cR, document.getElementById('b' + [j]).getElementsByClassName("colorHexInput")[0].value, fHex, l);
});

// Set Back Color Previews
$(document).ready(function () {
    var backFieldLength = $(".backColor").length + 1;
    for (var i = 1; i < backFieldLength; ++i) {
        setBackPreview('#b' + [i], $('#b' + [i]).children('input')[0].value);
    }
});



// Save Cell
$("body").on('click', '.saveBtnContainer', function () {
    var i = $(this).parents('.paletteTableCell')[0].id.match(/\d/g)[0],
        saveColor = $(this).parents('.paletteTableCell').children('.resultWrapper').children('.paletteInfoContainer').children('.textInfoContainer').children('.textInfo')[0].innerHTML;
    while (saveColor.charAt(0) === '#') {
        saveColor = saveColor.substr(1);
    }

    document.getElementById('t' + [i]).getElementsByClassName("colorHexInput")[0].value = saveColor;
    $("#t" + [i]).children(".colorHexInput").keydown();

});



// Remove Field

$("body").on("click", ".removeFieldContainer", function () {
    var i = $(this)
        .parents(".colorInputContainer")[0]
        .id.match(/\d/g)[0],
        parentId = $(this).parents(".colorInputContainer")[0].id;
    var backFieldlength = $(".backColorField").length;
    var textColorField = $(".textColorField").length;

    if (parentId.includes("t") && textColorField > 1) {
        document.getElementById("row" + i).remove();
        var rowLength = $(".paletteTableRow").length;
        for (var p = 0; p < rowLength; p++) {
            document
                .getElementsByClassName("paletteTableRow")
            [p].setAttribute("id", "row" + (p + 1));
            var rowCellLength = $("#row" + (p + 1)).children(
                ".paletteTableCell"
            ).length;
            for (r = 0; r < rowCellLength; r++) {
                $("#row" + (p + 1))
                    .children(".paletteTableCell")
                [r].setAttribute("id", "t" + (p + 1) + "b" + (r + 1));
            }
        }
        $(this)
            .parents(".colorInputContainer")
            .remove();
        var textFieldlength = $(".textColor").length;
        for (q = 0; q < textFieldlength; q++) {
            document
                .getElementsByClassName("textColorField")
            [q].setAttribute("id", "t" + (q + 1));
        }
    } else if (parentId.includes("b") && backFieldlength > 1 && backFieldlength <= 4) {
        $(this)
            .parents(".colorInputContainer")
            .remove();
        var backFieldlength = $(".backColor").length;
        var textFieldlength = $(".textColor").length;
        for (var m = 1; m < textFieldlength + 1; m++) {
            $("#row" + m)
                .children(".paletteTableCell")
            [i - 1].remove();
            var rowCellLength = $("#row" + m).children(".paletteTableCell")
                .length;
            for (var n = 0; n < rowCellLength; n++) {
                $("#row" + m)
                    .children(".paletteTableCell")
                [n].setAttribute("id", "t" + m + "b" + (n + 1));
            }
        };
        for (var j = 0; j < backFieldlength; j++) {
            document
                .getElementsByClassName("backColorField")
            [j].setAttribute("id", "b" + (j + 1));
        };
        if (backFieldlength < 4) {
            $('.addBackColorField').removeClass('hidden')

        } else {
            $('.addBackColorField').addClass('hidden')

        }
    }
});


// Add New Back Color
$(".addBackColorField").click(function () {
    var colorCount = $(this).parents(".leftPanelContainer").children(".backColorContainer").children(".colorInputContainer").length + 1,
        newColorField = '<div id="b' + colorCount + '" class="colorInputContainer backColorField "><div class="fieldIndicator bgRed"></div><div class="colorPreviewWrapper"><div class="colorPreviewContainer"><div class="colorPreview"></div></div></div><input class="colorHexInput clrBlack87 backColor" value="ffffff"><div class="removeFieldContainer "><div class="removeField bgRed"></div></div></div>',
        rowLength = $('.paletteTableRow').length;
    if (colorCount < 4) {
        $(".backColorContainer").append(newColorField);
        for (var i = 1; i < rowLength + 1; i++) {
            newCell = '<div id="t' + i + 'b' + colorCount + '" class="paletteTableCell"><div class="backgroundColorContainer"><span class="foregroundText">Aa</span></div><div class="resultWrapper "><div class="resultContainer"><div class="resultIcon"></div><div class="resultTypeContainer clrWhite"><span class="resultTypeAAA">AAA</span><span class="resultTypeAA">AA</span><span class="resultTypeAA18">AA18</span><span class="resultTypeDNP">DNP</span></div><span class="resultRatio clrWhite"> </span></div><div class="paletteInfoContainer" data-html2canvas-ignore><div class="brightnessSliderContainer"><div class="rangeTooltipWrapper"><div class="rangeTooltipContainer"></div></div><input type="range" name="lightness"></div><div class="textInfoContainer clrWhite"><span class="textInfoTitle">Text color</span><span class="textInfo"> </span></div><div class="backInfoContainer clrWhite"><span class="backInfoTitle">Background color</span><span class="backInfo"></span></div></div></div><div class="saveBtnContainer bgBlue clrWhite" data-html2canvas-ignore>Save</div><div class="resetBtnContainer bgRed clrWhite" data-html2canvas-ignore>Reset</div></div>'
            $("#row" + i).append(newCell);
        }
        $("#b" + colorCount).children(".colorHexInput").keydown();
    } else {
        $('.addBackColorField').addClass('hidden');
        $(".backColorContainer").append(newColorField);
        for (var i = 1; i < rowLength + 1; i++) {
            newCell = '<div id="t' + i + 'b' + colorCount + '" class="paletteTableCell"><div class="backgroundColorContainer"><span class="foregroundText">Aa</span></div><div class="resultWrapper "><div class="resultContainer"><div class="resultIcon"></div><div class="resultTypeContainer clrWhite"><span class="resultTypeAAA">AAA</span><span class="resultTypeAA">AA</span><span class="resultTypeAA18">AA18</span><span class="resultTypeDNP">DNP</span></div><span class="resultRatio clrWhite"> </span></div><div class="paletteInfoContainer" data-html2canvas-ignore><div class="brightnessSliderContainer"><div class="rangeTooltipWrapper"><div class="rangeTooltipContainer"></div></div><input type="range" name="lightness"></div><div class="textInfoContainer clrWhite"><span class="textInfoTitle">Text color</span><span class="textInfo"> </span></div><div class="backInfoContainer clrWhite"><span class="backInfoTitle">Background color</span><span class="backInfo"></span></div></div></div><div class="saveBtnContainer bgBlue clrWhite" data-html2canvas-ignore>Save</div><div class="resetBtnContainer bgRed clrWhite" data-html2canvas-ignore>Reset</div></div>'
            $("#row" + i).append(newCell);
        }
        $("#b" + colorCount).children(".colorHexInput").keydown();
    }
});

 


  $(".exportBtnWrapper").click(function() {
   $('.imgExport').children('canvas').remove();

    html2canvas($(".paletteTableWrapper"),     
    {
        onrendered: function(canvas) {
         document.body.appendChild(canvas);
        $(".imgExport").append(canvas);
        $(".imgExport").addClass("captured");
        $(".app").addClass("blurred");
      }
    });
  });

$(".imgExport").click(function() {
$(this).removeClass("captured");
$(".app").removeClass("blurred");
});