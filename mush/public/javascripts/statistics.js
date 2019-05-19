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

$(()=>{
    let regionC = $('#regionCanvas');
    let edibleC = $('#edibleCanvas');

    $.get('/db/stats/edible', function (res) {
        console.log('gained', res);
        fillData(res, edData);
    });

    $.get('/db/stats/region', function (res) {
        fillData(res, regData);
    });

    let regChart = createChart(regionC[0].getContext('2d'), regData, 'doughnut', 'Region stats');
    let edChart = createChart(edibleC[0].getContext('2d'), edData, 'pie', 'Edibility');
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

function statistics_sidebar_open() {
    document.getElementById("statisticsSidebar").style.width = "17%";
    document.getElementById("statisticsSidebar").style.display = "block";
    document.getElementById("openStatisticsSidebar").style.visibility = 'hidden';
}
function statistics_sidebar_close() {
    document.getElementById("statisticsSidebar").style.display = "none";
    document.getElementById("openStatisticsSidebar").style.visibility = "visible";
}