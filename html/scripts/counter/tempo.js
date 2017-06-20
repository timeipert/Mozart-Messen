/**
 * Created by timeipert on 05.06.17.
 */
const Chart1 = (function() {
    function createChart() {
        var backgroundColor = [
            "rgba(0,0,200,0.3)",
            "rgba(200,150,20,0.3)",
            "rgba(0,192,0,0.3)",
            "rgba(0,0,0,0.3)",
            "rgba(75,192,192,0.3)",
            "rgba(200,0,0,0.3)"
        ];

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ["Keine Änderung", "1x", "2x", "3x", "über 3x"],
                datasets: [{
                    label: "Kyrie",
                    data: [10,4,1,1,0],
                    backgroundColor: backgroundColor[0]
                },
                    {
                        label: "Gloria",
                        data: [12,1,1,0,0],
                        backgroundColor: backgroundColor[1]
                    },
                    {
                        label: "Credo",
                        data: [0,0,0,11,5],
                        backgroundColor: backgroundColor[2]

                    },
                    {
                        label: "Sanctus",
                        data: [2,13,1,0,0],
                        backgroundColor: backgroundColor[3]

                    },
                    {
                        label: "Benedictus",
                        data: [4,11,0,1,0],
                        backgroundColor: backgroundColor[4]
                    },
                    {
                        label: "Agnus Dei",
                        data: [2,13,1,0,0],
                        backgroundColor: backgroundColor[5]
                    }
                ]
            }
        });
    }
    return {
        createChart: createChart
    }
})();

const Chart2 = (function() {
    function createChart() {
        var backgroundColor = [
            "rgba(2, 57, 167, 0.5)",
            "rgba(2, 167, 139, 0.5)",
            "rgba(112, 167, 2, 0.5)",
            "rgba(167, 112, 2, 0.5)",
            "rgba(167, 57, 2, 0.5)",
            "rgba(167, 2, 2, 0.5)"
        ];
        var ctx = document.getElementById('myChart2').getContext('2d');
        var data = [];
        const dataSetLabels = ["Keine Änderung", "1x", "2x", "3x", "über 3x"];
        const dataSetData = [
            [1,0,2,0,1,2,2,2,2,3,1,4,3,3,1,3],
            [4,3,3,3,4,3,3,3,3,1,4,1,2,2,1,2],
            [0,0,1,1,1,0,1,1,1,1,1,1,1,1,3,1],
            [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [1,2,0,2,0,1,0,0,0,1,0,0,0,0,0,0]
        ];
        $.each(dataSetData, function(k,v) {
            var generatedData = v.map(function(num,index){
                for(var a = 0; a < k; a++) {
                    num += dataSetData[a][index];
                }
                return num;
            });
            console.log(generatedData);
            data.push({label:dataSetLabels[k], data: generatedData, backgroundColor: backgroundColor[k], fill: "-1"});
            data[0].fill = "origin";
        });
        const labels = [];
        $.each(dataSetData[0], function(k,v) {
            var m = k+1;
            labels.push("Messe Nr. "+m);
        });
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: data
            },
            options: {
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            console.log(tooltipItems, data);
                            return dataSetData[tooltipItems.datasetIndex][tooltipItems.index];
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