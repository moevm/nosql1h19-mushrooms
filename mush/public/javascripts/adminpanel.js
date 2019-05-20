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

var importData;

function send() {
    if( importData.length > 0 )
        $.post('/db/import', importData[0], function () {
            importData.shift();
            console.log('sent');
        });
}

function myLoop () {
    setTimeout(function () {
        if( importData.length > 0)
        {
            console.log(importData.length);
            send();
            myLoop();
        }
    }, 200)
}

function exportDB() {
    $.getJSON('/db/query/main', {}, function (res) {
        res.forEach(function (item) {
            delete item._id;
        });
        console.log(res);
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "backup.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
}
function importDB() {
    fileIn = $("<input />", {
        type: 'file',
        style: 'display: none',
    });

    fileIn.change(function () {
        let reader = new FileReader();
        reader.onload = function (event) {
            importData = JSON.parse(event.target.result);

            myLoop();

            queryToDb(fillAdmin);
            alert("Go take a brake, it's gonna take like 10*n sec")
        };
        reader.readAsText(event.target.files[0]);
    });
    fileIn.click();
}

//Fillers
function fillSuggestions(data){
    let list = $('#userList');
    list.empty();
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
    $.getJSON('/db/query/main', collectData(), function (data) {
        if( callback )
            callback(data);
    } );
}

//Filling sidebar
$.getJSON("/params", {},(data)=>{
    d = $.parseJSON(data);
    for(let k in d) {
        if( k !== 'name' && k !== 'description' && k !== 'region' && k!=='_id' ){
            $("#adminSidebarWrapper").append(twoComboLabel(k, d[k], "params params_correct"));
        }
    }
    $(".params").change(function () {
        queryToDb(fillAdmin);
    });
});

//INIT
$(()=>{
    document.getElementById('adminMush').onclick = function (){
        usermodal_open({ttype:'admin'});
    }

    //Query to suggestions
    $.getJSON('/db/query/suggestions', {}, function (data) {
        console.log('querying to suggestions');
        fillSuggestions(data);
    } );

    //On change of query/params string
    $("#query").bind('input', function () {
        queryToDb(fillAdmin);
    } );

    queryToDb(fillAdmin);
});
