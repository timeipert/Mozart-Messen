var nGramViewer = (function () {
    var measures = 0;
    var newFile = "";
    var musicScale =
        {
            "-12":"c/3", "-11":"c#/3","-10":"d/3","-9":"eb/3","-8":"e/3","-7":"f/3","-6":"f#/3","-5":"g/3","-4":"ab/3","-3":"a/3","-2":"bb/3","-1":"b/3",
            "0": "c/4", "1":"c#/4","2":"d/4","3":"eb/4","4":"e/4","5":"f/4","6":"f#/4","7":"g/4","8":"ab/4","9":"a/4","10":"bb/4","11":"b/4",
            "12":"c/5", "13":"c#/5","14":"d/5","15":"eb/5","16":"e/5","17":"f/5","18":"f#/5","19":"g/5","20":"ab/5","21":"a/5","22":"bb/5","23":"b/5",
            "24":"c/6","25":"c#/6","26":"d/6","27":"eb/6","28":"e/6","29":"f/6","30":"f#/6","31":"g/6","32":"ab/6","33":"a/6"};
    var startNoteScale = {
        "C": 12, "C#": 13, "D": 14, "D#": 15, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B-": 10, "B": 11
    }
    function drawViewer(file, ngramlist, n) {
        newFile = file;
        $("main").html('<div id="starter"><div class="sk-folding-cube"> <div class="sk-cube1 sk-cube"></div> <div class="sk-cube2 sk-cube"></div> <div class="sk-cube4 sk-cube"></div> <div class="sk-cube3 sk-cube"></div> </div></div>');
        $('main').load(file, function () {
            var content = $('main').html();
            var meta = content.match(/<!--HEADER\|([\w\s]+)\|([\w\s]+)\|([\w\s]+)\|([\w\s]+)|([\w\s]*)-->/i);
            if(meta) {
                var glob_missa = meta[1];
                var glob_mov = meta[2];
                var glob_n = meta[3];
                measures = meta[4];

                $(".subtitle").html(glob_missa+" - "+glob_mov);
                //Richtige Vorauswahl #mov-select
            }
            else {
                measures = 100;
            }
            buildSelectMenu(ngramlist, n);
            $('table').DataTable({
                "order": [[1, "desc"]],
                "drawCallback": function (settings) {
                    $("table").find("tr").each(function (index) {
                        if ($(this).children().last().html().match(/(\d)+:(\d)+/)) {
                            positionViewer.build($(this).children().last().find("ul"), index, 500, measures);
                        }
                        var ngrString = $(this).children().first().text();
                        if (ngrString.match(/\|/)) {
                            var nStr = ngrString.split(": ");
                            var ngram = nStr[1].split("|");
                            var out = "<div style='display:none;' id='sc" + index + "'>";
                            var val = startNoteScale[nStr[0]];
                            out += musicScale[val] + " ";
                            ngram.forEach(function (el) {
                                val += parseInt(el);
                                out += musicScale[val.toString()] + " ";
                            });
                            out += "</div>";
                            $(this).children().first().html(out);
                            buildScore(this,ngrString);
                        }
                    });
                },
                "initComplete": function(settings, json) {
                    nGramViewer.setLegend();
                    if(devmode) console.log("initComplete");
                    //$("#starter").remove();
                }
            });
        });
    }
    function buildScore(ele,ngrString) {
        var scoredomobject = $(ele).children().first();
        scoredomobject.append('<canvas width="500" height="80" title="'+ngrString+'"></canvas>');
        var canvas = $(ele).find("canvas")[0];
        var renderer = new Vex.Flow.Renderer(canvas,
            Vex.Flow.Renderer.Backends.CANVAS);
        var ctx = renderer.getContext();
        ctx.scale(0.7, 0.7);
        var stave = new Vex.Flow.Stave(0, 0, 500);
        // Add a treble clef
        stave.addClef("treble");
        stave.setContext(ctx).draw();
        var notes = [];
        var noteArray = scoredomobject.text().split(" ");
        if(noteArray[0] == "undefined") return false;
        for(noteKey in noteArray) {
            if(!aHOI(noteArray, noteKey)) continue;
            var el = noteArray[noteKey];
            if(el != "") {
                if (el.match(/#/)) {
                    notes.push(new Vex.Flow.StaveNote({clef: "treble", keys: [el], duration: "q"}).addAccidental(0, new Vex.Flow.Accidental("#")));
                }
                else if(el.match(/\Db/)) notes.push(new Vex.Flow.StaveNote({clef: "treble", keys: [el], duration: "q"}).addAccidental(0, new Vex.Flow.Accidental("b")));
                else notes.push(new Vex.Flow.StaveNote({clef: "treble", keys: [el], duration: "q"}));
            }
        }
        // Helper function to justify and draw a 4/4 voice
        Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes);
    }
    function buildSelectMenu(ngramlist,active) {
        var selmen = $("#ngram-select");
        selmen.html("");
        var selectMenuHtml = "";
        for(var i = 0; i < ngramlist.length; i++ ) {
            var value = ngramlist[i];
            var selected = "";
            if(value == active) selected = "selected='selected'";
            selectMenuHtml += "<option id='"+value+"' "+selected+">"+value+"</option>"
        }
        selmen.html(selectMenuHtml);
        selmen.on("change", function(event, ui) {
            drawViewer(fileDistributor.getFilePrototype($(this).val()), ngramlist, $(this).val());
        });
    }
    function setLegend() {
        if(devmode) console.log("setLegend");
        switch(status) {
            case "false":
                $("#movlegend").hide();
                if(devmode) console.log("false");
                $("#mislegend").hide();
                break;
            case "mis":
                $("#mislegend").show();
                if(devmode) console.log("mis");
                $("#movlegend").hide();
                break;
            case "mov":
                $("#movlegend").show();
                if(devmode) console.log("mov");
                $("#mislegend").hide();
                break;
        }
    }
    return {
        setLegend: setLegend,
        drawViewer: drawViewer
    };
})();
