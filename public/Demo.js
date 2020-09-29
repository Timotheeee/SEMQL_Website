"use strict";
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
                if (gs[j] === hs[i2]) {
                    words += gs[j] + " ";
                    found=true;
                } else {
                    if(i===0)console.log("pushing words: " + words);
                    if(words.trim().split(" ").length>1)highlights.push(words);
                    if(found)break;
                }
                if(found)i2++;
            }
            if(i===0)console.log("pushing words: " + words);
            if(words.trim().split(" ").length>1)highlights.push(words);
            
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
                var h = $("#comp" + i + "left").html().replace(window.human[i].highlights[j], "<span class='highlight'>" + window.human[i].highlights[j] + "</span>");
                var g = $("#comp" + i + "right").html().replace(window.gen[i].highlights[j], "<span class='highlight'>" + window.gen[i].highlights[j] + "</span>");

                $("#comp" + i + "left").html(h);
                $("#comp" + i + "right").html(g);
            }
//            if(i===1){
//                console.log($("#comp" + i + "left").html());
//                console.log(window.human[i].highlight);
//            }

            $("#fix" + i).on("click",function(){
               var id = $(this).attr("id").replace("fix","");
               var newhtml = $("#comp" + id + "right").html();
               var input = $("#input" + id).val();
               var words = input.split("!=");
               newhtml = newhtml.replace(words[0].trim()+" ",words[1].trim()+" ");
               console.log(id);
               console.log(newhtml);
               console.log(input);
               $("#comp" + id + "fixed").html(newhtml);
            });
            
            $("#sem" + i).on("click",function(){
               var id = $(this).attr("id").replace("sem","");
               var newhtml = $("#comp" + id + "right").html();
               $("#comp" + id + "fixed").html(newhtml);
               $("#comp" + id + "fixed").attr("style","color:yellow")
            });
        }
    }, 1000);
});