console.log('layout');

//Half-sticky top bar
var $window = $(window),
    $stickyEl = $('#topBarWrapper'),
    elTop = $stickyEl.offset().top;

$window.scroll(function() {
    $stickyEl.toggleClass('sticky', $window.scrollTop > elTop);
});

//Sidebar fuctions
function w3_open_left() {
    document.getElementById("main").style.marginLeft = "15%";
    document.getElementById("leftSidebar").style.width = "18%";
    document.getElementById("leftSidebar").style.display = "block";
    document.getElementById("openNav").style.visibility = 'hidden';
}
function w3_close_left() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("leftSidebar").style.display = "none";
    document.getElementById("openNav").style.visibility = "visible";
}

$.getJSON("/params", {},(data)=>{
        d = $.parseJSON(data);
        for(let k in d) {
            $("#leftWrapper").append(twoComboLabel(k, d[k], "params params_correct"));
        }
});

//World map
function openModal(){
    $('#modal').css("display", "block");
    $('#world-map').vectorMap({
        map: 'world_mill',
        onRegionClick: function(event, code){
            updateRegion(code);
        }
    });
}

//Init
$(function () {
    //Out of modal click
    var modal = document.getElementById('modal');
    window.onmousedown = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    //Region load
    if( typeof Cookies.get('region') !== 'undefined' ){
        updateRegion(Cookies.get('region'));
    }
    else {
        updateRegion("");
    }

    //Setting buttons
    $("#openMap").on('click', openModal) ;
    $("#resetRegion").on('click', function(){updateRegion("")});
    $("#black").attr('formaction', '/mushroom');
    $("#red").css('visibility', 'hidden');

});

