"use strict";



function compare(a, b) {
    if (a === undefined || b === undefined) return false;
    a = a.replace(/[^\w\s]/gi, '').toLowerCase();
    b = b.replace(/[^\w\s]/gi, '').toLowerCase();
    return a === b;
}

function contains(highlights, words) {
    for (var i = 0; i < highlights.length; i++) {
        //console.log("comparing: " + highlights[i].trim() + ", " + words.trim());
        if (highlights[i].trim().includes(words.trim())) {
            //console.log("returning true");
            return true;
        }

    }
    return false;
}

function compareTexts(i) {
    console.log(i);
    console.log(window.dat.data[i]);
    var h = $("#humanText" + i).html();
    var g = $("#generatedText" + i).html();
    var hs = h.split(" ");//human sentences split by space
    var gs = g.split(" ");
    var highlights = [];

    for (var i3 = 0; i3 < hs.length; i3++) {
        //if (i === 0) console.log("hs[i3] is " + hs[i3]);
        var words = "";
        var i2 = i3;
        var found = false;
        for (var j = 0; j < gs.length; j++) {//for every human word check how many generated words match in a row
            //if (i === 0) console.log("hs[i2] is " + hs[i2] + ", gs[j] is " + gs[j]);
            if (compare(gs[j], hs[i2])) {
                words += gs[j] + " ";
                found = true;
            } else {
                if (i === 0 && !contains(highlights, words)) console.log("pushing words: " + words);
                if (words.trim().split(" ").length > 1 && !contains(highlights, words)) highlights.push(words);
                if (found) break;
            }
            if (found) i2++;
        }
        //if (i === 0) console.log("pushing words: " + words);
        if (words.trim().split(" ").length > 1 && !contains(highlights, words)) highlights.push(words);

    }



    for (var i4 = 0; i4 < highlights.length; i4++) {
        highlights[i4] = highlights[i4].trim();
    }

    var highlights2 = [];
    $.each(highlights, function (i, el) {
        if ($.inArray(el, highlights2) === -1) highlights2.push(el);
    });

    if (i === 0) console.log(highlights2);

    for (var j = 0; j < highlights2.length; j++) {
        var h = $("#humanText" + i).html().replace(highlights2[j], "<span class='highlight" + j + "'>" + highlights2[j] + "</span>");
        var g = $("#generatedText" + i).html().replace(highlights2[j], "<span class='highlight" + j + "'>" + highlights2[j] + "</span>");

        $("#humanText" + i).html(h);
        $("#generatedText" + i).html(g);
    }
}


$.ajax({url: "/api/data/", method: "get"}).done(function (dat) {
    //console.log(dat);
    window.everything = [];
    window.dat = dat;
    for (var i = 0; i < dat.data.length; i++) {
        everything.push({id: i, dbid: dat.data[i].question_id, human: {text: dat.data[i].human.trim()}});
        //if(i===50)break;
    }

    if (window.home) {
        window.home.update();
    }

//    setTimeout(function () {
//        //temporary
//        $("#input5").html("f => male; who were nominated for oscars for their contribution to movies?=>;What are the death places of people whose gender is=Where did x die?");
//        $("#input4").html("2607 or less?=at most 2607?");
//        $("#input3").html("gender => name");
//        $("#input2").html("people who were not deceased=those who have not died");
//        $("#input1").html("all movies=movies;which were produced by companies whose name is=>produced by");
//    }, 4000);
});

$("html").on("click", "#generatedText0 *", function () {
    var type = this.outerHTML.split(">")[0].replace("<", "").split(" ")[0];
    //console.log(type);
    //$("." + type).addClass("highlight");
    $("text." + type).append(" (this one)");
    setTimeout(function () {
        //$("." + type).removeClass("highlight");
        if ($("text." + type).html() !== undefined && $("text." + type).html().includes("this one"))
            $("text." + type).html($("text." + type).html().replace(" (this one)", ""));
    }, 3000);
});

function load(id) {
    console.log("load");
    console.log(id);
//    if (id === 0 || id === 1) {
    var text = $("#humanText" + id).html();
    console.log(text);



    $("#select0").html($("#select0 option:selected").text().replace("_", " "));
    $("#select1").html($("#select1 option:selected").text().replace("_", " "));
    $("#select2").html($("#select2 option:selected").text().replace("_", " "));
    $("#select3").html($("#select4 option:selected").text().replace("_", " "));

    //text = text.replace(/<sele.*<\/select>/,select);
    text = $("#humanText" + id).text();
    console.log(text);


    $.ajax({url: "http://localhost:5004/api/text_to_tree?text=" + text.replace(" ", "_"), method: "get"}).done(function (dat2) {
        console.log("THE DATA (" + id + ")" + ":");
        console.log(dat2);
        displayTree("#generatedTree" + id, dat2.sampled_data);
        //$("#fixedTree" + id).html("no fixed tree yet");
        $('#generatedSQL' + id).html(dat2.sql);
        //$('#fixedSQL' + id).html("no fixed SQL yet");
        //console.log("adding syn question to generatedtext: " + '#generatedText' + id + ", " + (dat2.synthetic_question ? dat2.synthetic_question : dat2.gold_synthetic_question));
        $('#generatedText' + id).html(dat2.synthetic_question === "" ? "error on the backend" : dat2.synthetic_question);
        //console.log("running compare with " + id);
        //compareTexts(id);



    });
    //compareTexts(id);
//    } else {
//        var dbid = window.everything[id].dbid;
//        console.log(dbid);
//        $.ajax({url: "http://localhost:5004/api/sample_tree_for_question?tid=" + dbid, method: "get"}).done(function (dat2) {
//            console.log("THE DATA:");
//            console.log(dat2);
//            console.log("load id 2 is now: " + id);
//            $("#generatedTree" + id).html("");
//            displayTree("#generatedTree" + id, dat2.sampled_data);
//            $("#fixedTree" + id).html("no fixed tree yet");
//            $('#generatedSQL' + id).html(dat2.sql);
//            $('#fixedSQL' + id).html("no fixed SQL yet");
//            console.log("adding syn question to generatedtext: " + '#generatedText' + id + ", " + (dat2.synthetic_question ? dat2.synthetic_question : dat2.gold_synthetic_question));
//            $('#generatedText' + id).html(dat2.synthetic_question ? dat2.synthetic_question : dat2.gold_synthetic_question);
//            console.log("running compare with " + id);
//            compareTexts(id);
//        });
//    }



}

var attributes;
$.getJSON("attributes_for_table.json", function (json) {
    attributes = json;
    console.log("loaded");
});

function genSelect(table, def) {
    def = def.replace(" ", "_");
    def = def.endsWith("s") ? def.slice(0, -1) : def;
    console.log(def);
    var fields = attributes[table];

    var select = "<select name='" + table + "'>";
    for (var i = 0; i < fields.length; i++) {
        var cur = fields[i][0];
        if (cur === "id") continue;
        var sel = cur === def ? "selected='selected'" : "";
        select += "<option value='" + cur + "' " + sel + ">" + cur + "</option>\n";
    }
    select += "</select>";
    return select;
}

function fixit(id) {
    console.log("RUNNING FIX " + id);
    //if (id === 0) {// || id === 1

    setTimeout(function () {
        var gen = $("#generatedText" + id).html();
        var attr_el_array = $("#generatedText" + id + " attr");
        for (var i = 0; i < attr_el_array.length; i++) {
            var attr_el = $(attr_el_array[i]);
            var attr = attr_el.attr('table');
            var attrText = attr_el.text();
            var select = genSelect(attr, attrText);
            gen = gen.replace(/<attr[^<]+<\/attr>/, "<div id='select" + i + "'>" + select + "</div>");
        }
        $("#humanText" + id).html(gen);
    }, 1);





//    } else {
//        var newhtml = $("#generatedText" + id).html().split('<div id="semanticInputButtons">')[0];
//        var input = $("#input" + id).val();
//        var commands = input.split(";");
//        for (var c = 0; c < commands.length; c++) {
//            var command = commands[c];
//            if (command.includes("=>")) {
//                var words = command.split("=>");
//                newhtml = newhtml.replace(" " + words[0].trim() + " ", "<span class='bad'> " + words[1].trim() + "</span> ");
//                $("#fixedText" + id).html(newhtml);
//            } else {
//                var words = command.split("=");
//                newhtml = newhtml.replace(words[0].trim() + "", "<span class='correct'>" + words[0].trim() + "</span> ");
//                newhtml = newhtml.replace(words[1].trim() + "", "<span class='correct'>" + words[1].trim() + "</span> ");
//                var left = $("#humanText" + id).html();
//                var right = $("#generatedText" + id).html();
//                left = left.replace(words[0].trim() + "", "<span class='correct'>" + words[0].trim() + "</span> ");
//                left = left.replace(words[1].trim() + "", "<span class='correct'>" + words[1].trim() + "</span> ");
//                right = right.replace(words[0].trim() + "", "<span class='correct'>" + words[0].trim() + "</span> ");
//                right = right.replace(words[1].trim() + "", "<span class='correct'>" + words[1].trim() + "</span> ");
//                $("#humanText" + id).html(left);
//                $("#generatedText" + id).html(right);
//
//
//                $("#fixedText" + id).html(newhtml);
//            }
//        }
//    }
}