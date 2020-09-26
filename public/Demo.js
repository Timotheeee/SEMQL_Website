"use strict";
$.ajax({url: "/api/data/", method: "get"}).done(function (dat) {
    
    window.human = [];
    window.gen = [];
<<<<<<< HEAD
    for (var i = 0; i < dat.data.length; i++) {
        var h = dat.data[i].human;
        var g = dat.data[i].generated;
        var hs = h.split(" ");//human sentences split by space
        var gs = g.split(" ");
        var longestStreakCount = 0;
        var longestStreak = "";

        for (var i3 = 0; i3 < hs.length; i3++) {
            if(i===1)console.log("hs[i3] is " + hs[i3]);
            var streak = 0;
            var words = "";
            var i2 = i3;
            var found = false;
            for (var j = 0; j < gs.length; j++) {//for every human word check how many generated words match in a row
                if(i===1)console.log("hs[i2] is " + hs[i2] + ", gs[j] is " + gs[j]);
=======
    for (let i = 0; i < dat.data.length; i++) {
        let h = dat.data[i].human;
        let g = dat.data[i].generated;
        let hs = h.split(" ");//human sentences split by space
        let gs = g.split(" ");
        let longestStreakCount = 0;
        let longestStreak = "";

        for (let i3 = 0; i3 < hs.length; i3++) {
            //console.log("hs is " + hs[i]);
            let streak = 0;
            let words = "";
            let i2 = i3;
            for (let j = 0; j < gs.length; j++) {//for every human word check how many generated words match in a row
                //console.log("hs[i2] is " + hs[i2] + ", gs[j] is " + gs[j]);
>>>>>>> Fixed loading Demo from csv file
                if (gs[j] === hs[i2]) {
                    streak++;
                    words += gs[j] + " ";
                    found=true;
                    if(i===1)console.log("streak is " + streak + ", words is " + words);
                    if (streak > longestStreakCount) {
                        longestStreakCount = streak;
                        longestStreak = words;
                    }
                } else {
                    if (streak > longestStreakCount) {
                        longestStreakCount = streak;
                        longestStreak = words;
                    }
                    if(found)break;
                }
                if(found)i2++;
            }
        }

        if(i===1)console.log(longestStreak);





        human.push({text: h.trim(), highlight: longestStreak.trim(), id: i,side:"left"});
        gen.push({text: g.trim(), highlight: longestStreak.trim(), id: i,side:"right"});
        //break;
    }

    if (window.home) {
        window.home.update();
    }


    setTimeout(function () {
<<<<<<< HEAD
        for (var i = 0; i < window.gen.length; i++) {
            if(i===1){
                console.log($("#comp" + i + "left").html());
                console.log(window.human[i].highlight);
            }
            var h = $("#comp" + i + "left").html().replace(window.human[i].highlight, "<span class='highlight'>" + window.human[i].highlight + "</span>");
            var g = $("#comp" + i + "right").html().replace(window.gen[i].highlight, "<span class='highlight'>" + window.gen[i].highlight + "</span>");
=======
        for (let i = 0; i < window.gen.length; i++) {
            let h = $("#comp" + i + "left").html().replace(window.human[i].highlight, "<span class='highlight'>" + window.human[i].highlight + "</span>");
            let g = $("#comp" + i + "right").html().replace(window.gen[i].highlight, "<span class='highlight'>" + window.gen[i].highlight + "</span>");
>>>>>>> Fixed loading Demo from csv file

            $("#comp" + i + "left").html(h);
            $("#comp" + i + "right").html(g);
        }
    }, 1000);





});