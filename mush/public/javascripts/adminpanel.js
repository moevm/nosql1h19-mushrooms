function usermodal_open()
{
    $('#usertrash_modal').css("display", "block");
}

function usermodal_close()
{
    $('#usertrash_modal').css("display", "none");
}

//Sidebar fuctions
function admin_sidebar_open() {
    document.getElementById("adminSidebar").style.width = "15%";
    document.getElementById("adminSidebar").style.display = "block";
    document.getElementById("openAdminSidebar").style.visibility = 'hidden';
}
function admin_sidebar_close() {
    document.getElementById("adminSidebar").style.display = "none";
    document.getElementById("openAdminSidebar").style.visibility = "visible";
}

//Sidebar creation
function twoComboLabel(key, val){
    let d = $('<div />');
    s = $('<select />', {class: "params", name: key, id: key});
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
    for(let k in d) {
        $("#adminSidebarWrapper").append(twoComboLabel(k, d[k]));
        $("#userWrapper").append(twoComboLabel(k, d[k]));
    }
});