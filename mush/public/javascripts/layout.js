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

//Sidebar creation
function ComboLabel(key, val){
    let d = $('<div />');
    s = $('<select />', {class: "params, params_correct", name: key, id: key});
    $('<option />', {value: 0, text: key}).appendTo(s);
    for( let k of val )
    {
        $('<option />', {value: Object.values(k)[0], text: Object.keys(k)[0]}).appendTo(s);
    }
    d.append(s);
    return d;
}

//TODO Maybe it's good idea to add $(()=>{}) BUT In this case search.js won't find combolabels
$.getJSON("/params", {},(data)=>{
        d = $.parseJSON(data);
        console.log(d);
        for(let k in d) {
            $("#leftWrapper").append(ComboLabel(k, d[k]));
            //тут я добавила эту штуку,которую бы не стоило сюда добавлять
            $("#formWrapper").append(ComboLabel(k, d[k]));
        }
});

//World map
function openModal(){
    $('#modal').css("display", "block");
    $('#world-map').vectorMap({
        map: 'world_mill',
        onRegionClick:function(event, code){
            updateRegion(code);
        }
    });
}


//User's form
function open_form() {
    $('#modalform').css("display", "block");

}

function close_form() {
    $('#modalform').css("display", "none");
}

function readFile(file, onLoadCallback){
    let reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsDataURL(file);
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

    //Loading image to suggestions
    /*$("#url_input").on('change', function (e) {
        readFile(this.files[0], function (e) {
            let form = $("#suggestion");
            form.append($("<input />",{
                type: "hidden",
                name: "img",
                value: e.target.result
            }))
        })
    })*/
});

