/**
 * Created by timeipert on 09.05.17.
 */
/* Output: string of filename
 * Input: Data root dictionary
 * Asks for file...
 */

var fileDistributor = (function() {
        var startN = 5;
        var abbr = {"Alle Messen": "complet", "Agnus Dei": "ad", "Kyrie": "k", "Credo": "c", "Benedictus": "b", "Gloria": "g", "Sanctus": "s", "Ganze Messe":"m"}
        var abbrinv = { "complet": "Alle Messen","ad":"Agnus Dei",  "k":"Kyrie",  "c": "Credo", "b": "Benedictus", "g": "Gloria", "s": "Sanctus","m": "Ganze Messe"}
        var rootFile = "data/dict.json";
        var rootDir = "data/";
        var dataList;
        var fileName;
        var nGramLists = {};
        function buildDistDialog() {
            dialog = $( "#dist-dialog" ).dialog({
                autoOpen: false,
                height: 400,
                width: 350,
                modal: true,
                buttons: {
                    "Select": function() {
                        console.log(startN);
                        nGramViewer.drawViewer(rootDir+fileName+".html",nGramLists[fileName],startN);
                        $(".menu").hide();
                        dialog.dialog( "close" );
                        $("#loadwhite").remove();
                    }
                },
                close: function() {
                    dialog.dialog( "close" );
                    $(".menu").hide();
                }
            });
            $( "#open-dist" ).button().on( "click", function() {
                dialog.dialog( "open" );
                $(".menu").show();
            });
        }
        function showDataList() {
            buildDistDialog();
            $.getJSON(rootFile, function (dataList) {
                var htmlString = "<ul>";

                for(k in dataList) {
                    if(!aHOI(dataList, k)) continue;
                    var v = dataList[k];
                    htmlString += "<li data-jstree='{\"disabled\":true}'>Missa Nr."+k+"<ul>";
                    var movements;
                    for (movements in v) {
                        if(!aHOI(v, movements)) continue;
                        var ngrams = v[movements];

                        var id = "m"+k+"/"+movements;
                        htmlString += "<li data-jstree='{\"disabled\":true}'>"+abbrinv[movements]+"<ul>";
                        for(n in ngrams) {
                            if(!aHOI(ngrams, n)) continue;
                            var vl = ngrams[n];

                            var idd = id+vl;
                            htmlString += "<li id='"+idd+"'>"+vl+"</li>";
                            nGramLists[idd] = ngrams;
                        }
                        htmlString+="</ul></li>";
                    }
                    htmlString += "</ul></li>";
                }
                htmlString += "</ul>";
                $('#jstree').html(htmlString);
                $('#jstree').on('changed.jstree', function (e, data) {
                    fileName = data.selected[0];
                    var ngramSelected = fileName.match(/[a-z]+([0-9]+)/);
                    startN = ngramSelected[1];

                })
                    .jstree();
            });
        }
        function getFilePrototype(ngram) {
            var fName = fileName+".html";
            var protfile = fName.match(/(.*?)(\d)+\.html/i);
            return rootDir+protfile[1]+ngram+".html";
        }
        function getFileInfos() {
            var MissaDict = {};
            $.getJSON(rootFile, function (dataList) {
                for(k in dataList) {
                    if(!aHOI(dataList, k)) continue;
                    MissaDict[k] = {};
                    //Missa
                    for(movements in dataList[k]) {
                        var ngrams = dataList[k][movements];
                        //Movements
                        MissaDict[k][movements] = ngrams;
                    }
                }
            });
            return MissaDict;
        }
    return {
        show: showDataList,
        getInfo: getFileInfos,
        getFilePrototype: getFilePrototype
    }
})();