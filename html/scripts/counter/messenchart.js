/**
 * Created by timeipert on 22.04.17.
 */


var k = 0;
Object.keys(data).forEach(function(key) {
    var totalCount = 0;
    //INFO über Anzahl und Gewichtung der Noten
    var infoStr = "<ul>";
    var item = data[key];
    var labelofPie = [];
    var dataofPieAbsolute = [];
    var dataofPie = [];
    var activeElement = "";
    var activeLink = "";
    Object.keys(item.datasets).forEach(function(innerKey){
        innerItem = item.datasets[innerKey];
        labelofPie.push(innerItem["label"]);
        dataofPieAbsolute.push(innerItem["countAll"]);
        totalCount += parseInt(innerItem["countAll"]);
        infoStr += "<li>"+ innerItem["label"] + ": "+innerItem["countAll"]+"</li>";
    });
    dataofPieAbsolute.forEach(function(k) {

        dataofPie.push(k/totalCount);
    });
    infoStr += "<li>Gesamt: "+totalCount+"</li>";
    infoStr += "</ul>";
    dataPie =  {
        labels: labelofPie,
        datasets: [
            {
                data: dataofPie,
                backgroundColor: [
                    "rgba(0,0,200,0.4)",
                    "rgba(200,150,20,0.4)",
                    "rgba(0,192,0,0.4)",
                    "rgba(0,0,0,0.4)",
                    "rgba(75,192,192,0.4)",
                    "rgba(200,0,0,0.4)"
                ],
                hoverBackgroundColor: [
                    "rgba(0,0,200,0.4)",
                    "rgba(200,150,20,0.4)",
                    "rgba(0,192,0,0.4)",
                    "rgba(0,0,0,0.4)",
                    "rgba(75,192,192,0.4)",
                    "rgba(200,0,0,0.4)"
                ]
            }]
    };
    if(k == 0) {
        activeElement = "activeChild"
        activeLink = "is-active";
    }
    var keyid = key.replace("Nr ", "");
    keyid = keyid.replace("missa", "");
    //HTML generieren
    $("#main").append("<div class='missa "+activeElement+"' id='"+keyid+"'> <h1>Missa Nr. "+keyid+"</h1> <div class='columns'>"+
    "<div class='column is-4' style='padding: 0 10px;'> " +
        "  <div class=\"infoBoxNoten\">"+infoStr+"</div><canvas class='piechart' id='"+key+"_pie' width='100' height='60'></canvas><p class='chartDeclaration'>Verteilung Noten gesamt in den Sätzen</p></div> "+
        "<div class='column is-7'><canvas class='barchart' id='"+key+"' width='800' height='500'></canvas> <p class='chartDeclaration'>Verteilung der einzelnen Noten in den Sätzen</p></div> </div>");
    $("#eachmissa").append("<li><a class='"+activeLink+" missalink' id='link"+keyid+"' onclick='goto(\""+keyid+"\");'>Missa Nr. "+keyid+"</a></li>")
    var keyPie = key+"_pie";
    drawPieChart(dataPie, keyPie);
    drawChart(item, key);
    k+=1;
});
function drawPieChart(data, index) {
    var ctx = document.getElementById(index);
    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: data,
    });
}
function goto(key) {
        $(".activeChild").addClass('animated fadeOut' );
        //wait for animation to finish before removing classes
        window.setTimeout( function(){
            $(".activeChild").removeClass('animated fadeOut');
            $(".missa").removeClass("activeChild");
            $("#"+key).addClass("activeChild");
            $(".activeChild").addClass('animated fadeIn');
        },400);
    $(".missalink").removeClass("is-active");
    $("#link"+key).addClass("is-active");
}
function drawChart(item, index) {
    var ctx = document.getElementById(index);
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: item,
        showTooltip: true,
        tooltipTemplate: "Test: <%= value %>",
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}