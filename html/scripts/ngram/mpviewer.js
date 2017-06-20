/**
 * Created by timeipert on 27.04.17.
 */

Array.prototype.unique = function() {
    var newArray = new Array();
    label:for(var i=0; i<this.length;i++ ) {
        for(var j=0; j<newArray.length;j++ ) {
            if(newArray[j] == this[i])
                continue label;
        }
        newArray[newArray.length] = this[i];
    }
    return newArray;
}
var positionViewer = (function() {

    function buildVector(el, index, vwidth, measures) {
        var thisElement = el.html();

        var positionGroupMeta = thisElement.match(/(\d)+:(\d)+( \([a-z]+\))?(\(\d+\))?/g);
        var positionGroup = thisElement.match(/(\d)+:(\d)+/g);
        positionGroupMeta.sort(function(a, b){
            var c = a.split(" ")[0];
            var d = b.split(" ")[0];
            return c.split(":")[0]-d.split(":")[0];
        });
        var objectTitle = positionGroupMeta.join(" - ");

        el.parent().html("<div  id=\"canvas" + index + "\" class='measureline'></div>");
        var paper = new Raphael(document.getElementById('canvas' + index), vwidth, 20);
        var c = paper.path("M0 20L" + vwidth + " 20");
        for (var i = 1; i <= 19; i++) {
            var s = i * (vwidth / 20);
            paper.path("M" + s + " 20L" + s + " 16").attr({"stroke-opacity": 0.5, "stroke-size": 0.6});
        }
        paper.path("M0 20L0 15").attr({"stroke-size": 1.2});
        paper.path("M" + vwidth + " 20L" + vwidth + " 15").attr({"stroke-size": 1.2});
        var mov = { "(ad)":"#9999e9",  "(k)":"#b7e6e6",  "(c)": "#99e699", "(b)": "#E9D5A1", "(g)": "#999999", "(s)": "#E99999"}

        var lastMeasure = "";
        for(k in positionGroup) {
            if(!aHOI(positionGroup, k)) continue;
            var positionElement = positionGroup[k];

            var positions = positionElement.split(":");
            if(parseInt(positions[1]) > lastMeasure) lastMeasure = parseInt(positions[1]);
            if(measures < lastMeasure)
            {
                measures = lastMeasure;
                if(devmode) console.log("Maximal Measures:" +measures);
            }
        }
        for(i in positionGroup) {
            if(!aHOI(positionGroup,i)) continue;
            var positionElement = positionGroup[i];
            var movement = positionGroupMeta[i].split(" ");
            var color = "";
            if (!(movement[1] in mov)) {
                color = "#000000";
                status = "false";
            }
            else {
                color = mov[movement[1]]; status = "mov";
            }
            var miss;
            if(miss = positionGroupMeta[i].match(/\(([a-z]+\))\((\d+)\)/)) {
                color = missaColor[miss[2]];
                status = "mis";
            }

            var positions = positionElement.split(":");
            if(parseInt(positions[1]) > lastMeasure) lastMeasure = parseInt(positions[1]);
            if(measures < lastMeasure) measures = lastMeasure;
            positions[0] *= (vwidth / measures);
            positions[1] *= (vwidth / measures);
            var positionGroupLen = positionGroup.length;

            var rectWidth = positions[1] - positions[0] + 3

            paper.rect(positions[0], 0, rectWidth, 20).attr({
                "stroke-width": 0,
                "fill": color,
                "fill-opacity": 0.4
            });


        }
        $("#canvas"+index).attr("title",objectTitle+" ("+measures+")");
    }
    return {
        build: buildVector
    };
})();



