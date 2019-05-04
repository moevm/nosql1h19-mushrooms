function collectData(){
    data = {};
    //Sidebar
    if( $("#mySidebar").is(":visible") )
    {
        $(".params").each(function () {
            let val = $("option:selected", this).val();
            if( val !== '0' )
                data[$("option:first", this).text()] = val;
        });
    }
    //name,region
    let name = $("#query").val();
    let region = $("#openMap").val();
    if( region !== "" )
        data.region = region;
    if( name !== "" )
        data.name = name;
    return data;
}

function queryToDb(callback = false){
    $.getJSON('/db-query', collectData(), function (data) {
        console.log('querying');
        console.log(data);
        if( callback )
            callback(data);
    } );
}

//TODO add the rest of the code
function updateRegion(code = "") {
    let button = $("#openMap");
    if( code === "" )
    {
        button.text("Select Region");
        $("#resetRegion").css("visibility", "hidden");
    }
    else
    {
        button.text(code);
        $("#resetRegion").css("visibility", "visible");
    }
    console.log("region updated")
    button.val(code);
    $("#region").val(code).trigger('change');
    Cookies.set('region', code);
    $("#modal").css("display", "none");
}

