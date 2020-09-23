"use strict";
$.ajax({url: "/api/data/", method: "get"}).done(function (dat) {
    
    window.human = [];
    window.gen = [];
    for (var i = 0; i < dat.data.length; i++) {
        var h = dat.data[i].human;
        var g = dat.data[i].generated;
        var hs = h.split(" ");//human sentences split by space
        var gs = g.split(" ");
        var longestStreakCount = 0;
        var longestStreak = "";

        for (var i3 = 0; i3 < hs.length; i3++) {
            //console.log("hs is " + hs[i]);
            var streak = 0;
            var words = "";
            var i2 = i3;
            for (var j = 0; j < gs.length; j++) {//for every human word check how many generated words match in a row
                //console.log("hs[i2] is " + hs[i2] + ", gs[j] is " + gs[j]);
                if (gs[j] === hs[i2]) {
                    streak++;
                    words += gs[j] + " ";
                    //console.log("streak is " + streak + ", words is " + words);
                } else {
                    if (streak > longestStreakCount) {
                        longestStreakCount = streak;
                        longestStreak = words;
                    }
                }
                i2++;
            }
        }

        console.log(longestStreak);





        human.push({text: h, highlight: longestStreak, id: i,side:"left"});
        gen.push({text: g, highlight: longestStreak, id: i,side:"right"});
        //break;
    }

    if (window.home) {
        window.home.update();
    }


    setTimeout(function () {
        for (var i = 0; i < window.gen.length; i++) {
            var h = $("#comp" + i + "left").html().replace(window.human[i].highlight, "<span class='highlight'>" + window.human[i].highlight + "</span>");
            var g = $("#comp" + i + "right").html().replace(window.gen[i].highlight, "<span class='highlight'>" + window.gen[i].highlight + "</span>");

            $("#comp" + i + "left").html(h);
            $("#comp" + i + "right").html(g);
        }
    }, 1000);





});