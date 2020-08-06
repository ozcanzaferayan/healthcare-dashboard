// JS

var ctx = document.getElementById('recentResultsChart').getContext('2d');
var gradientFill = ctx.createLinearGradient(0, 0, 0, 200);
gradientFill.addColorStop(0.1, "rgba(109,110,227, .3)");
gradientFill.addColorStop(1, "rgba(255,255,255, .3)");


var data = {
    labels: ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", ""],
    datasets: [{
        backgroundColor: "rgba(0,0,0,0)",
        borderColor: "#6d6ee3",
        borderWidth: 2,
        fill: true,
        backgroundColor: gradientFill,
        data: [3, 5, 4, 10, 8, 9, 3, 15, 14, 17],
        pointRadius: 5,
        pointHoverRadius: 7,
        pointColor: "#FFFFFF",
        fillColor: "#FFFFFF",
        strokeColor: "#FF0000",

    }]
};

var options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    tooltips: {
        mode: 'index',
        intersect: true,
        yPadding: 10,
        xPadding: 10,
        caretSize: 8,
        backgroundColor: '#fff',
        titleFontColor: "#6d6ee3",
        bodyFontStyle: 'bold',
        bodyFontColor: "#737295",
        displayColors: false,
        callbacks: {
            label: function(tooltipItems, data) {
                return "10.5";
            }
        },
        bevelWidth: 3,
        bevelHighlightColor: 'rgba(255, 255, 255, 0.75)',
        bevelShadowColor: 'rgba(0, 0, 0, 0.5)'
    },
    showAllTooltips: true,
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                maxTicksLimit: 5,
                min: 0,
            },
            gridLines: {
                display: true
            }
        }],
        xAxes: [{
            display: true,
            ticks: {
                fontSize: 12,
                fontColor: '#c3c6de'
            },
            gridLines: {
                display: false
            }
        }]
    },
    elements: {
        point: {
            radius: 0
        }
    }
};

Chart.pluginService.register({
    beforeRender: function(chart) {
        if (chart.config.options.showAllTooltips) {
            // create an array of tooltips
            // we can't use the chart tooltip because there is only one tooltip per chart
            chart.pluginTooltips = [];
            chart.config.data.datasets.forEach(function(dataset, i) {
                chart.getDatasetMeta(i).data.forEach(function(sector, j) {
                    chart.pluginTooltips.push(new Chart.Tooltip({
                        _chart: chart.chart,
                        _chartInstance: chart,
                        _data: chart.data,
                        _options: chart.options.tooltips,
                        _active: [sector]
                    }, chart));
                });
            });

            // turn off normal tooltips
            chart.options.tooltips.enabled = false;
        }
    },
    afterDraw: function(chart, easing) {
        if (chart.config.options.showAllTooltips) {
            // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
            if (!chart.allTooltipsOnce) {
                if (easing !== 1)
                    return;
                chart.allTooltipsOnce = true;
            }

            // turn on tooltips
            chart.options.tooltips.enabled = true;
            Chart.helpers.each(chart.pluginTooltips, function(tooltip, i) {
                if (i !== 3) return;
                tooltip.initialize();
                tooltip.update();
                // we don't actually need this since we are not animating tooltips
                tooltip.pivot();
                tooltip.transition(easing).draw();
            });
            chart.options.tooltips.enabled = false;
        }
    }
});
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
});