function usermodal_open(data) {
    $('#usertrash_modal').css("display", "block");
    d = false;
    let form = $('#modalForm');
    form.append($('<input />', { //save img
        type: 'hidden',
        name: 'img',
        id: "hmeh"
    }));

    if( data ){
        d = true;

        $(".modalParams").each(function () {
            $(this).val(data[this.name])
        });
        $('#userimg').attr('src', data.img); //setting img source

        form.append($('<input />', { //save id
            type: 'hidden',
            name: '_id',
            value: data._id
        }));

        form.append($('<input />', { //save doc typ
            type: 'hidden',
            name: 'ttype',
            value: data.ttype
        }));

        $("#hmeh").val(data.img);
    }
    else{
        $(".modalParams[type=text]").each(function () {
            $(this).val("");
        });
        $(".modalParams:not([type=text],[type=hidden])").each(function () {
            $(this).val('0');
        });
        $("#userimg").attr("src", "");
    }
}

function usermodal_close() {
    $('#usertrash_modal').css("display", "none");
    $("input[name=_id]").remove();
    $("input[name=ttype]").remove();
    $("#hmeh").remove();
}

//Image (oh god, i spent too much time on it)
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#userimg').attr('src', e.target.result);
            let form = $("#modalForm");
            $("#hmeh").val(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(()=>{
    $.getJSON("/params", {},(data)=>{
        d = $.parseJSON(data);
        for(let k in d) {
            if( k !== 'name' && k !== 'description' && k !== 'region' && k!=='_id' ){
                $("#userWrapper").append(twoComboLabel(k, d[k], "modalParams"));
            }
        }
    });
    //On image change
    $("#imgInput").change(function() {
        readURL(this);
    });
});