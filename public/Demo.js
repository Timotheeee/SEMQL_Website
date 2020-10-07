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

    window.human = [];
    window.gen = [];
    window.fixed = [];
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


        human.push({text: h.trim(), highlights: highlights2, id: i,side:"left"});
        gen.push({text: g.trim(), highlights: highlights2, id: i,side:"right"});
        fixed.push({text: "", id: i,side:"fixed"});
        
        if(i===50)break;

    }

    if (window.home) {
        window.home.update();
    }

    setTimeout(function () {
        for (var i = 0; i < window.gen.length; i++) {
            for (var j = 0; j < window.human[i].highlights.length; j++) {
                var h = $("#comp" + i + "left").html().replace(window.human[i].highlights[j], "<span class='highlight" + j + "'>" + window.human[i].highlights[j] + "</span>");
                var g = $("#comp" + i + "right").html().replace(window.gen[i].highlights[j], "<span class='highlight" + j + "'>" + window.gen[i].highlights[j] + "</span>");

                $("#comp" + i + "left").html(h);
                $("#comp" + i + "right").html(g);
            }
//            if(i===1){
//                console.log($("#comp" + i + "left").html());
//                console.log(window.human[i].highlight);
//            }

            $("#fix" + i).on("click",function(){
                var id = $(this).attr("id").replace("fix","");
                var newhtml = $("#comp" + id + "right").html().split('<div id="semanticInputButtons">')[0];
                var input = $("#input" + id).val();
                var commands = input.split(";");
                for (var c = 0; c < commands.length;c++) {
                    var command = commands[c];
                    if(command.includes("=>")){
                        var words = command.split("=>");
                        newhtml = newhtml.replace(" " + words[0].trim()+" ","<span class='bad'> " + words[1].trim()+"</span> ");
                        $("#comp" + id + "fixed").html(newhtml);
                    } else {
                        var words = command.split("=");
                        newhtml = newhtml.replace(words[0].trim()+ "","<span class='correct'>" + words[0].trim()+ "</span> ");
                        newhtml = newhtml.replace(words[1].trim()+ "","<span class='correct'>" + words[1].trim()+ "</span> ");
                        var left = $("#comp" + id + "left").html();
                        var right = $("#comp" + id + "right").html();
                        left = left.replace(words[0].trim()+ "","<span class='correct'>" + words[0].trim()+ "</span> ");
                        left = left.replace(words[1].trim()+ "","<span class='correct'>" + words[1].trim()+ "</span> ");
                        right = right.replace(words[0].trim()+ "","<span class='correct'>" + words[0].trim()+ "</span> ");
                        right = right.replace(words[1].trim()+ "","<span class='correct'>" + words[1].trim()+ "</span> ");
                        $("#comp" + id + "left").html(left);
                        $("#comp" + id + "right").html(right);
                        
                        
                        $("#comp" + id + "fixed").html(newhtml);
                    }

                }
                $("#treeExample" + id).attr("src", "../img/TreeExample1.png");
                $('#sqlExample' + id).html("SELECT DISTINCT example1, example2 FROM example.customers GROUP BY example1");

            });

        }
        //temporary
        $("#comp3right textarea").html("f => male; who were nominated for oscars for their contribution to movies?=>;What are the death places of people whose gender is=Where did x die?");
        $("#comp2right textarea").html("2607 or less?=at most 2607?");
        $("#comp1right textarea").html("gender => name");
        $("#comp0right textarea").html("people who were not deceased=those who have not died");
    }, 1000);
});

