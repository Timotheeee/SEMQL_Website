"use strict";

function compare(a,b){
    if(a === undefined || b === undefined)return false;
    a = a.replace(/[^\w\s]/gi, '').toLowerCase();
    b = b.replace(/[^\w\s]/gi, '').toLowerCase();
    return a===b;
}

function contains(highlights,words){
    for (var i = 0; i < highlights.length; i++) {
        //console.log("comparing: " + highlights[i].trim() + ", " + words.trim());
        if(highlights[i].trim().includes(words.trim())){
            //console.log("returning true");
            return true;
        }
            
    }
    return false;
}

$.ajax({url: "/api/data/", method: "get"}).done(function (dat) {
    console.log(dat);
    window.everything = [];
    for (var i = 0; i < dat.data.length; i++) {
        var h = dat.data[i].human;
        var g = dat.data[i].generated;
        var hs = h.split(" ");//human sentences split by space
        var gs = g.split(" ");
        var highlights = [];

        for (var i3 = 0; i3 < hs.length; i3++) {
            if(i===0)console.log("hs[i3] is " + hs[i3]);
            var words = "";
            var i2 = i3;
            var found = false;
            for (var j = 0; j < gs.length; j++) {//for every human word check how many generated words match in a row
                if(i===0)console.log("hs[i2] is " + hs[i2] + ", gs[j] is " + gs[j]);
                if (compare(gs[j],hs[i2])) {
                    words += gs[j] + " ";
                    found=true;
                } else {
                    if(i===0 && !contains(highlights,words))console.log("pushing words: " + words);
                    if(words.trim().split(" ").length>1 && !contains(highlights,words))highlights.push(words);
                    if(found)break;
                }
                if(found)i2++;
            }
            if(i===0)console.log("pushing words: " + words);
            if(words.trim().split(" ").length>1  && !contains(highlights,words))highlights.push(words);
            
        }



        for (var i4 = 0; i4 < highlights.length; i4++) {
            highlights[i4] = highlights[i4].trim();
        }

        var highlights2 = [];
        $.each(highlights, function(i, el){
            if($.inArray(el, highlights2) === -1) highlights2.push(el);
        });

        if(i===0)console.log(highlights2);



        everything.push({id: i, dbid: dat.data[i].question_id, human:{text: h.trim(), highlights: highlights2},gen:{text: g.trim(), highlights: highlights2},fixed:{text: ""}});

        
        if(i===50)break;

    }

    if (window.home) {
        window.home.update();
    }

    setTimeout(function () {
        for (var i = 0; i < window.everything.length; i++) {
            for (var j = 0; j < window.everything[i].human.highlights.length; j++) {
                var h = $("#humanText" + i).html().replace(window.everything[i].human.highlights[j], "<span class='highlight" + j + "'>" + window.everything[i].human.highlights[j] + "</span>");
                var g = $("#generatedText" + i).html().replace(window.everything[i].gen.highlights[j], "<span class='highlight" + j + "'>" + window.everything[i].gen.highlights[j] + "</span>");

                $("#humanText" + i).html(h);
                $("#generatedText" + i).html(g);
            }

            $("#fix" + i).on("click",function(){
                var id = $(this).attr("id").replace("fix","");
                var newhtml = $("#generatedText" + id).html().split('<div id="semanticInputButtons">')[0];
                var input = $("#input" + id).val();
                var commands = input.split(";");
                for (var c = 0; c < commands.length;c++) {
                    var command = commands[c];
                    if(command.includes("=>")){
                        var words = command.split("=>");
                        newhtml = newhtml.replace(" " + words[0].trim()+" ","<span class='bad'> " + words[1].trim()+"</span> ");
                        $("#fixedText" + id).html(newhtml);
                    } else {
                        var words = command.split("=");
                        newhtml = newhtml.replace(words[0].trim()+ "","<span class='correct'>" + words[0].trim()+ "</span> ");
                        newhtml = newhtml.replace(words[1].trim()+ "","<span class='correct'>" + words[1].trim()+ "</span> ");
                        var left = $("#humanText" + id).html();
                        var right = $("#generatedText" + id).html();
                        left = left.replace(words[0].trim()+ "","<span class='correct'>" + words[0].trim()+ "</span> ");
                        left = left.replace(words[1].trim()+ "","<span class='correct'>" + words[1].trim()+ "</span> ");
                        right = right.replace(words[0].trim()+ "","<span class='correct'>" + words[0].trim()+ "</span> ");
                        right = right.replace(words[1].trim()+ "","<span class='correct'>" + words[1].trim()+ "</span> ");
                        $("#humanText" + id).html(left);
                        $("#generatedText" + id).html(right);
                        
                        
                        $("#fixedText" + id).html(newhtml);
                    }

                }
                //http://localhost:5000/api/sample_tree_for_question?tid=5d415bb5692f198cdabe8885
                var dbid = window.everything[id].dbid;
                $.ajax({url: "http://localhost:5000/api/sample_tree_for_question?tid=" + dbid, method: "get"}).done(function (dat2) {
                    console.log(dat2);

                    //todo: convert the json to a graph and display it
                    $("#humanTree" + id).html(JSON.stringify(dat2.gold_data));
                    $("#generatedTree" + id).html(JSON.stringify(dat2.sampled_data));
                    $("#fixedTree" + id).html("no fixed tree yet");
                });
//                $("#generatedTree" + id).attr("src", "../img/TreeExample1.png");
//                $("#fixedTree" + id).attr("src", "../img/TreeExample1.png");
//                $('#humanTree' + id).html("SELECT DISTINCT humanSQL, example2 FROM example.customers GROUP BY example1");
                $('#generatedSQL' + id).html("SELECT DISTINCT generatedSQL, example2 FROM example.customers GROUP BY example1");
                $('#fixedSQL' + id).html("SELECT DISTINCT fixedSQL, example2 FROM example.customers GROUP BY example1");

            });

        }
        //temporary
        $("#generatedText3 textarea").html("f => male; who were nominated for oscars for their contribution to movies?=>;What are the death places of people whose gender is=Where did x die?");
        $("#generatedText2 textarea").html("2607 or less?=at most 2607?");
        $("#generatedText1 textarea").html("gender => name");
        $("#generatedText0 textarea").html("people who were not deceased=those who have not died");
    }, 1000);
});

