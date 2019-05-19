//Data
let edData = {
    data: [],
    labels: [],
    colours: []
};
let regData = {
    data: [],
    labels: [],
    colours: []
};
let parData = {
    data: [],
    labels: [],
    colours: []
};

//Charts
let regChart;
let edChart;
let parChart;

//Canvases
let regionC;
let edibleC;
let paramC;

$(()=>{
    //INIT
    //fill sidebar
    $.getJSON("/params", {},(data)=>{
        let d = $.parseJSON(data);
        for(let k in d) {
            $("#sidebarContent").append(twoComboLabel(k, d[k], "params params_correct"));
        }
        $(".params").change(updateChart);
    });

    //Canvas
    regionC = $('#regionCanvas');
    edibleC = $('#edibleCanvas');
    paramC = $('#paramCanvas');

    $.get('/db/stats/edible', function (res) {
        console.log('gained', res);
        fillData(res, edData);
    });

    $.get('/db/stats/region', function (res) {
        fillData(res, regData);
    });

    regChart = createChart(regionC[0].getContext('2d'), regData, 'doughnut', 'Region stats');
    edChart = createChart(edibleC[0].getContext('2d'), edData, 'pie', 'Edibility');
    parChart = createChart(paramC[0].getContext('2d'), parData, 'pie', 'Query by parameters');
});

function createChart(context, dataObj, type, label) {
    let chart = new Chart(context, {
        type: type,
        data: {
            labels: dataObj.labels,
            datasets: [{
                label: label,
                backgroundColor: dataObj.colours,
                data: dataObj.data
            }]
        },
    });
}

function fillData(src, dst) {
    src.forEach(function (it) {
        dst.data.push(it.count);
        dst.labels.push(it._id);
        dst.colours.push(getRandomColor());
    })
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateChart() {
    console.log('updating params');
    let data = {};
    $(".params").each(function () {
        let val = $(this).val();
        if( val !== '0' )
            data[$(this).attr('name')] = val;
    });
    console.log(data);
    $.ajax({
        type: 'GET',
        url: '/db/stats/params',
        data: data,
        success: function (res) {
            console.log(res);
            fillData(res, parData);
            //paramC[0].getContext('2d').clearRect(0,0, paramC[0].width, paramC[0].height);
            //parChart.clear();
            parChart = createChart(paramC[0].getContext('2d'), parData, 'pie', 'Query by parameters');
        }
    });
}

function statistics_sidebar_open() {
    document.getElementById("statisticsSidebar").style.width = "17%";
    document.getElementById("statisticsSidebar").style.display = "block";
    document.getElementById("openStatisticsSidebar").style.visibility = 'hidden';
}
function statistics_sidebar_close() {
    document.getElementById("statisticsSidebar").style.display = "none";
    document.getElementById("openStatisticsSidebar").style.visibility = "visible";
}