window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

var copyOnGen = false;
var outputText;
var textContent = [];
var modes = {
    paragraphs: 1,
    words: 2
}
var currentMode = modes.paragraphs;

function getTextData() {
    $.getJSON("config.json", function (data) {
        $.grep(data.textContentData, function (dataValue, index) {
            textContent.push(dataValue);
        });
    });
}

$(function () {
    browser.storage.local.get(['CopyOnGen'], function (result) {
        $("#copy-check").prop('checked', result.CopyOnGen);
        copyOnGen = result.CopyOnGen;
    });
    $(".active").removeClass("active");
    if (currentMode = modes.paragraphs) {
        $("#para-btn").addClass("active");
    } else if (currentMode = modes.words) {
        $("#words-btn").addClass("active");
    }
    $('input').on("paste", function (e) {
        e.preventDefault();
    });

    getTextData();
});

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateText(mode, length, paraCount) {
    var output;
    if (length <= 0 || paraCount <= 0) {
        output = null;
        $("#result-output").attr("placeholder", "Invalid parameters !!! Please retry with different values...");
    } else {
        output = null;
        if (mode == modes.words) {
            for (j = 0; j < length; j++) {
                if (j == 0) {
                    output = capitalizeFirstLetter(textContent[Math.floor(Math.random() * textContent.length)]);
                } else {
                    if (j != 0) {
                        output += textContent[Math.floor(Math.random() * textContent.length)];
                    } else {
                        output += capitalizeFirstLetter(textContent[Math.floor(Math.random() * textContent.length)]);
                    }
                }
                if (j != length - 1) {
                    output += " ";
                }
            }
            output += ".";
        } else if (mode == modes.paragraphs) {
            for (i = 0; i < paraCount; i++) {
                for (j = 0; j < length; j++) {
                    if (i == 0 && j == 0) {
                        output = capitalizeFirstLetter(textContent[Math.floor(Math.random() * textContent.length)]);
                    } else {
                        if (j != 0) {
                            output += textContent[Math.floor(Math.random() * textContent.length)];
                        } else {
                            output += capitalizeFirstLetter(textContent[Math.floor(Math.random() * textContent.length)]);
                        }
                    }
                    if (j != length - 1) {
                        output += " ";
                    }
                }
                if (i != paraCount - 1) {
                    output += ".\n\n";
                } else output += ".";
            }
        }
    }
    return output;
}

function copyResult() {
    if (outputText != null) {
        $("#result-output").select();
        document.execCommand("copy");
        $("#copy-btn").text("Copied !")
        setTimeout(function () {
            $("#copy-btn").text("Copy to clipboard")
        }, 750);
    } else {
        $("#copy-btn").text("There is nothing to copy !")
        setTimeout(function () {
            $("#copy-btn").text("Copy to clipboard")
        }, 750);
    }
}

$("#gen-btn").click(function () {
    var length = $("#length-input").val();
    var paraCount = $("#paraCount-input").val();
    outputText = generateText(currentMode, length, paraCount);
    $("#result-output").text(outputText);
    if (copyOnGen) {
        copyResult();
    }
});

$("#copy-btn").click(function () {
    copyResult();
});

$("#copy-check").click(function () {
    var IsChecked = this.checked;
    copyOnGen = this.checked;
    browser.storage.local.set({
        'CopyOnGen': IsChecked
    }, function () {});
});

$("#words-btn").click(function () {
    currentMode = modes.words;
    $(".active").removeClass("active");
    $("#words-btn").addClass("active");
    $("#paraCount-container").slideUp("fast");
});

$("#para-btn").click(function () {
    currentMode = modes.paragraphs;
    $(".active").removeClass("active");
    $("#para-btn").addClass("active");
    $("#paraCount-container").slideDown("fast");
});