/**
 * Created by timeipert on 02.06.17.
 */

const Chart1 = (function() {
    function buildDataSets(data) {
        var dataSet = [];
        const colors = [
            'rgba(128, 255, 0, 0.1)',
            'rgba(200, 255, 0, 0.13)',
            'rgba(255, 255, 0, 0.16)',
            "rgba(215,209,0,0.2)",
            'rgba(255, 109, 0, 0.23)',
            'rgba(255, 146, 0, 0.26)',
            'rgba(255, 0, 0, 0.3)',
            'rgba(255, 105, 180, 0.33)',
            'rgba(168, 0, 185, 0.36)',
            'rgba(101, 0, 155, 0.4)',
            'rgba(72, 0, 255, 0.43)',
            'rgba(4, 0, 208, 0.46)',
            'rgba(0, 68, 220, 0.5)',
            'rgba(1, 114, 226, 0.51)',
            'rgba(11, 175, 162, 0.52)',
            'rgba(0, 212, 28, 0.53)'
        ];
        $.each(data, function (dataKey, dataValue) {
            var dataSetObject = {}
            var dataKeyOneHigher = dataKey + 1;
            dataSetObject.label = "Messe " + dataKeyOneHigher;
            dataSetObject.data = dataValue;
            dataSetObject.backgroundColor = colors[dataKey];
            dataSet.push(dataSetObject);
        });
        return dataSet;
    }

    function processData(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(";");
        var lines = [];

        for (var i = 0; i < allTextLines.length - 1; i++) {

            var data = allTextLines[i].split(';');

            if (data.length == headers.length) {

                var tarr = [];

                for (var j = 0; j < headers.length; j++) {
                    if (i == 0) {
                        lines.push([]);

                    }
                    lines[j].push(data[j]);
                }

            }
        }
        return lines;
    }

    function createChart(dataInput) {
        var processedData = processData(dataInput);
        var data = buildDataSets(processedData);

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ["Kyrie", "Gloria", "Credo", "Sanctus", "Benedictus", "Agnus Dei"],
                datasets: data
            }
        });
    }
    return {
        createChart: createChart
    }
})();
const Chart2 = (function() {
    function createChart() {
        var ctx = document.getElementById('myChart2').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["Kyrie", "Gloria", "Credo", "Sanctus", "Benedictus", "Agnus Dei"],
                datasets: [{
                    label: "Durchschnitt",
                    data: [58,
                        144,
                        206,
                        35,
                        56,
                        105,
                    ],
                    backgroundColor: [
                        "rgba(0,0,200,0.3)",
                        "rgba(200,150,20,0.3)",
                        "rgba(0,192,0,0.3)",
                        "rgba(0,0,0,0.3)",
                        "rgba(75,192,192,0.3)",
                        "rgba(200,0,0,0.3)"
                    ],
                    hoverBackgroundColor: [
                        "rgba(0,0,200,0.3)",
                        "rgba(200,150,20,0.3)",
                        "rgba(0,192,0,0.3)",
                        "rgba(0,0,0,0.3)",
                        "rgba(75,192,192,0.3)",
                        "rgba(200,0,0,0.3)"
                    ]
                }]
            }
        });
    }
    return {
        createChart: createChart
    }
})();
const Chart3 = (function() {
    function createChart() {
        var data = [
            471,
            1010,
            348,
            1110,
            512,
            847,
            557,
            457,
            360,
            824,
            666,
            436,
            375,
            523,
            630,
            530
        ];

        var labels = [];
        var trendsimple = [];
        var trendpoly = [
            715.4264706,
            698.5323529,
            682.0605042,
            666.0109244,
            650.3836134,
            635.1785714,
            620.3957983,
            606.0352941,
            592.0970588,
            578.5810924,
            565.487395,
            552.8159664,
            540.5668067,
            528.739916,
            517.3352941,
            506.3529412
        ];
        $.each(data, function(dataKey) {
            var dataKeyOneHigher = dataKey+1;
            labels.push("Messe Nr. "+dataKeyOneHigher);
            trendsimple.push(-13.94*dataKeyOneHigher + 722.0);
        });
        console.log(data);
        console.log(labels);
        var ctx = document.getElementById('myChart3').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets:  [
                    {
                        label: "Gesamt",
                        data: data,
                        backgroundColor: ["rgba(200,150,20,0.6)"]
                    },
                    {
                        label: 'Trend (Simple linear regression)',
                        data: trendsimple,
                        backgroundColor: "rgba(255,255,255,0)",
                        borderColor: "rgba(0,0,0,0.8)",
                        // Changes this dataset to become a line
                        type: 'line'
                    },
                    {
                        label: 'Trend (Polynomial regression)',
                        data: trendpoly,
                        backgroundColor: "rgba(255,255,255,0)",
                        borderColor: "rgba(255,0,0,0.8)",
                        // Changes this dataset to become a line
                        type: 'line'
                    }
                ]
            }
        });
    }
    return {
        createChart: createChart
    }
})();
const Chart4 = (function() {
    function createChart() {
        var ctx = document.getElementById('myChart4').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Kyrie", "Credo", "Sanctus/Benedictus", "Agnus Dei"],

                datasets: [{
                    label: "Durchschnitt Mozart",
                    data: [58,

                        206,
                        91,

                        105
                    ], backgroundColor: [
                        "rgba(200,150,20,0.6)",
                        "rgba(200,150,20,0.6)",
                        "rgba(200,150,20,0.6)",
                        "rgba(200,150,20,0.6)"

                    ]



                },{
                    label: "Durchschnitt MacIntyre",
                    data: [58,

                        164,
                        102,

                        87
                    ], backgroundColor: [
                        "rgba(0,0,200,0.6)",
                        "rgba(0,0,200,0.6)",
                        "rgba(0,0,200,0.6)",
                        "rgba(0,0,200,0.6)"
                    ]

                }]
            }
        });
    }
    return {
        createChart: createChart
    }
})();
const Chart5 = (function() {
    function createChart() {
        var taktZahlen = [
            [
                471,
                1010,
                348,
                1110,
                512,
                847,
                557,
                457,
                360,
                824,
                666,
                436,
                375,
                523,
                630,
                530],
                [
                    37,140,40,108,43,56,73,41,38,83,40,68,29,38,31,56
                ],
                [
                    78,340,49,420,120,160,179,59,113,129,111,64,78,112,198,99
                ],
                [
                    225,336,146,356,101,392,139,183,76,406,282,152,84,90,151,176
                ],
                [
                    38,45,22,50,36,32,30,35,20,40,30,31,38,39,46,27
                ],
                [
                    31,24,13,41,52,80,36,37,43,60,89,87,77,69,98,53
                ],
                [
                    62,125,78,135,160,127,100,102,70,106,114,34,69,175,106,119
                ]
            ];
        var dataSetLabels = ["Kyrie", "Gloria", "Credo", "Sanctus", "Benedictus", "Agnus Dei"];
        var labels = [];
        var dataSet = [

        ];
        var backgroundColor = [
            "rgba(0,0,200,0.5)",
            "rgba(200,150,20,0.5)",
            "rgba(0,192,0,0.5)",
            "rgba(0,0,0,0.5)",
            "rgba(75,192,192,0.5)",
            "rgba(200,0,0,0.5)"
        ];

        for(var i = 0; i < 6; i++) {
            var generatedData = taktZahlen[i+1].map(function(num,index){
                    for(var a = 0; a < i; a++) {
                        num += taktZahlen[a+1][index];
                    }
                    return num;
                });
            var ob = {
                label: dataSetLabels[i],
                data: generatedData,
                backgroundColor: backgroundColor[i],
                fill: "-1"
            }
            if(!i) ob.fill = "origin"
            dataSet.push(ob);
        }
        $.each(taktZahlen[0], function(dataKey,dataValue) {
            var dataKeyOneHigher = dataKey+1;
            labels.push("Messe Nr. "+dataKeyOneHigher);
        });
        console.log(labels, dataSet);
        var ctx = document.getElementById('myChart5').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets:  dataSet
            },
            options: {
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            console.log(tooltipItems, data);
                            return taktZahlen[tooltipItems.datasetIndex][tooltipItems.index];
                        }
                    }
                }
            }
        });
    }
    return {
        createChart: createChart
    }
})();