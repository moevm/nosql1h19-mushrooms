//TODO miniatures overflow

function miniature(item){
    console.log(item);
    upWrap = $("<div />", {
        style: "width: 20%; height: auto; margin: 10px; text-align: center;",
        class: "w3-card popup",
    });
    upWrap.append($('<img />', {
        src: item.img[0],
        style: "max-width: 100%"
    }));
    lwrap = $("<div />", {
        style: "width: 100%; height: 100%; text-align: center;", text: item.name});
    upWrap.append(lwrap);

    popup = $("<div />", {
        class: "popuptext",
        id: item.name,
    });

    upWrap.append(popup);

    $('#contWrap').append(upWrap);
    upWrap.on('click', function () {
        console.log("Pop up should be here");
        console.log(item.name);
        document.getElementById(item.name).classList.toggle("show");
    });
    for( k in item )
    {
        if( k !== "name" && k !== 'img' && k !== '_id' && k!== "__v" )
        {
            popup.append($('<label />',
                {
                    text: k + ' : ' + item[k],
                    style: "display: block"
                }));
        }
    }
}

function fillContent(data) {
    $("#contWrap").empty();
    data.forEach(miniature);
}

$(()=> {
    console.log("search");
    w3_close_left();
    if (Object.keys(q).length > 2){
        console.log('open sidebar');
        w3_open_left();
    } //invent some clever way to check if sidebar was open on the previous page

    $("#query").val(q.name);
    for (let k in q) {
        if (k === "name") continue;
        $(`select[name=${k}]`).val(q[k]);
    }
    $("#topBarWrapper").addClass("w3-card");

    //On change of query string
    $("#query").bind('input', function () {
        queryToDb(fillContent);
    } );
    //On change of params
    $(".params").change(function () {
        queryToDb(fillContent);
    });

    $("#region").change(function () {
        console.log("STILL FUCK THIS STUPID LANGUAGE");
        queryToDb(fillContent);
    });

    $("#resetRegion").on('click', function () {
        updateRegion();
    });

    queryToDb(fillContent);
});