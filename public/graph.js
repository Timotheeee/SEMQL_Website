var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 960 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

var iter = 0,
        duration = 750,
        root;

var tree = d3.layout.tree()
        .size([height, width]);

var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x, d.y];
        });

var svg;



function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        d.y = d.depth * 60;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++iter);
            });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("questionID", questionID)
            .attr("transform", function (d) {
                return "translate(" + (source.y0) + "," + (source.x0) + ")";
            })
            .on("click", click);

    nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

    nodeEnter.append("text")
            .attr("x", function (d) {
                return d.children || d._children ? -13 : -13;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "end";
            })
            .text(function (d) {
                return d.name;
            })
            .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + (d.x) + "," + (d.y) + ")";
            });

    nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

    nodeUpdate.select("text")
            .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

    nodeExit.select("circle")
            .attr("r", 1e-6);

    nodeExit.select("text")
            .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

    // Transition links to their new position.
    link.transition()
            .duration(duration)
            .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });


}

function click(d) {
    //console.log(d);
    var action = d.name.split(":")[0];
    var text = convert(action);
    var text2 = "";
    if (d.name.split(":").length > 1) {
        var part2 = d.name.split(":")[1].trim();
        if (part2.includes(".")) {
            text2 += part2.split(".")[0] + " " + part2.split(".")[1];
        }
        if (part2.includes("_")) {
            text2 += part2.split("_")[0] + " " + part2.split("_")[1];
        }
    }



    highlight(text, text2, d.questionID);
}

function convert(action) {
    switch (action) {
        case "Sum":
            return "What is the total $attr of all $sub?";
        case "Average":
            return "What is the average $attr of all $sub?";
        case "Done":
            return "What are the $child?";
        case "IsEmpty":
            return "Are there any $child?";
        case "Count":
            return "How many $child are there?";
        case "Min":
            return "$sub with minimum $attr";
        case "Max":
            return "$sub with maximum $attr";

        default:
            return action;

    }



}

function highlight(text, part2, id) {
    var words = text.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (words[i] === "" || words[i] === " " || words[i] === undefined)
            continue;
        console.log("highlighting " + words[i]);
        $("#generatedText" + id).highlight(words[i]);
        setTimeout(function () {
            $("#generatedText" + id).unhighlight(words[i]);
        }, 5000);
    }
    words = part2.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (words[i] === "" || words[i] === " " || words[i] === undefined)
            continue;
        console.log("highlighting " + words[i]);

        $("#generatedText" + id).highlight(words[i]);
        $("#generatedText" + id).highlight(words[i] + "s");
        $("#generatedText" + id).highlight(words[i].replace("y", "ies"));

        setTimeout(function () {
            $("#generatedText" + id).unhighlight(words[i].replace("y", "ies"));
            $("#generatedText" + id).unhighlight(words[i] + "s");
            $("#generatedText" + id).unhighlight(words[i]);
        }, 2000);
    }

}

function fix(node, parent) {
    if (node.children[0])
        fix(node.children[0], node.name);
    if (node.children[1])
        fix(node.children[1], node.name);

    var end = node.attributes.attribute_name ? node.attributes.attribute_name : node.attributes.table_name;
    if (node.attributes.attribute_name0) {
        end = node.attributes.attribute_name0;// + " and \n" + node.attributes.attribute_name1;
    }
    node.parent = parent;
    node.name = node.name.replace(/\(.+\)/, "") + ": " + end;
    if (node.name === "Done: undefined")
        node.name = "Done";
    node.questionID = questionID;
    if (node.name.length > 25 && node.name.includes("Merge"))
        node.name = "Merge: " + node.name.split(".")[1];
}

var questionID;

function displayTree(id, data) {
    console.log(data);
    questionID = id.replace("#generatedTree", "");
//    data.parent = "null";
//    var parentname = data.name;
//    var current = data.children[0];
    fix(data, "null");
//    while (true) {
//        console.log("loop");
//        if (current && current.children) {
//            //also attribute_name0 attribute_name1
//            var end = current.attributes.attribute_name ? current.attributes.attribute_name : current.attributes.table_name;
//            if (current.attributes.attribute_name0) {
//                end = current.attributes.attribute_name0;// + " and \n" + current.attributes.attribute_name1;
//            }
//            current.parent = parentname;
//            current.name = current.name.replace(/\(.+\)/, "") + ": " + end;
//            current = current.children[0];
//        } else {
//            break;
//        }
//    }
    console.log(data);


    svg = d3.select(id).append("svg")
            .attr("width", 900)
            .attr("height", 600)
            .append("g")
            .attr("transform", "translate(" + (-10) + "," + (30) + ")");

    root = data;
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    //d3.select(self.frameElement).style("height", "500px");
}