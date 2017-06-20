/**
 * Created by timeipert on 28.04.17.
 */
var devmode = true;
var status = false;
$.extend( true, $.fn.dataTable.defaults, {

    "searching": false
} );
function aHOI(array, prop) { //array has own index?
    resp = array.hasOwnProperty(prop); // 2^32 - 2´
    return resp;
}
$(document).ready(function(){

    try {
        $(document).tooltip();
    } catch(e) {
        $("main").html("Error: Cannot load jquery or jquery ui");
    }
    try {
        fileDistributor.show();
    } catch(e) {
        $("main").html("Error on fileDistributor")
    }
    dialog.dialog( "open" );

    //nGramViewer.drawViewer(startfile,[7,8,9]);

});
var missaColor = [
    'rgba(128, 255, 0, 0.1)',
    'rgba(200, 255, 0, 0.1)',
    'rgba(255, 255, 0, 0.1)',
    "rgba(215,209,0,0.1)",
    'rgba(255, 109, 0, 0.1)',
    'rgba(255, 146, 0, 0.1)',
    'rgba(255, 0, 0, 0.1)',
    'rgba(255, 105, 180, 0.1)',
    'rgba(168, 0, 185, 0.1)',
    'rgba(101, 0, 155, 0.1)',
    'rgba(72, 0, 255, 0.1)',
    'rgba(4, 0, 208, 0.1)',
    'rgba(0, 68, 220, 0.1)',
    'rgba(1, 114, 226, 0.1)',
    'rgba(11, 175, 162, 0.1)',
    'rgba(0, 212, 28, 0.1)'
];
cmissaColor = missaColor.length;
//Legende (alle Messen) generieren
for(var k = 1;cmissaColor>=k;k++) {
    var v = missaColor[k-1];
    $("#mislegend").append("<figure><label for='missa"+k+"'>Messe "+k+"</label><div class='legend-color-field' style='background: "+v+"'></div></figure>");
}