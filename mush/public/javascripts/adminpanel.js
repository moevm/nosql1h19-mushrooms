//Sidebar fuctions
function admin_sidebar_open() {
    document.getElementById("adminSidebar").style.width = "17%";
    document.getElementById("adminSidebar").style.display = "block";
    document.getElementById("openAdminSidebar").style.visibility = 'hidden';
}
function admin_sidebar_close() {
    document.getElementById("adminSidebar").style.display = "none";
    document.getElementById("openAdminSidebar").style.visibility = "visible";
}

//Sidebar creation
/*function twoComboLabel(key, val, classs){
    let d = $('<div />');
    s = $('<select />', {class: classs, name: key, id: key});
    $('<option />', {value: 0, text: key}).appendTo(s);
    for( let k of val )
    {
        $('<option />', {value: Object.values(k)[0], text: Object.keys(k)[0]}).appendTo(s);
    }
    d.append(s);
    return d;
}*/

//Fillings
function fillSuggestions(data){
    let list = $('#userList');
    if( data.length === 0)
    {
        list.append("Suggestion list is empty");
        return;
    }
    data.forEach(function (sugggestion) {
        li = $("<li />");
        sugggestion.ttype = 'user';
        li.text(sugggestion.name);
        li.on('click', function () {
            usermodal_open(sugggestion);
        });
        list.append(li);
    })
}

function fillAdmin(data){
    let list = $('#adminList');
    list.empty();
    if( data.length === 0)
    {
        list.append("Your DB is empty");
        return;
    }
    data.forEach(function (sugggestion) {
        li = $("<li />");
        sugggestion.ttype = 'admin';
        console.log(sugggestion);
        li.text(sugggestion.name);
        li.on('click', function () {
            usermodal_open(sugggestion);
        });
        list.append(li);
    })
}

function collectData(){
    data = {};
    //Sidebar
    if( $("#adminList").is(":visible") )
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
    /*if( region !== "" )
        data.region = region;*/
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

//INIT
$(()=>{
    //Filling sidebar
    $.getJSON("/params", {},(data)=>{
        d = $.parseJSON(data);
        for(let k in d) {
            if( k !== 'name' && k !== 'description' && k !== 'region' && k!=='_id' ){
                $("#adminSidebarWrapper").append(twoComboLabel(k, d[k], "params, params_correct"));
            }
        }
    });

    //Query to suggestions
    $.getJSON('/suggestions', {}, function (data) {
        console.log('querying to suggestions');
        fillSuggestions(data);
    } );

    //On change of query/params string
    $("#query").bind('input', function () {
        queryToDb(fillAdmin);
    } );
    $(".params").change(function () {
        queryToDb(fillAdmin);
    });
    queryToDb(fillAdmin);
});
