/*
    Auteur:         Jordy van Venrooij
    Controleur:     Gijs van Lokven
    Aanmaakdatum:   13-09-2018
    Bestandsnaam:*/
var filename 	= 	'Vlidator.js'; //verander dit naar het bestands naam
//neemt de huidige tijd
var currentdate = new Date();
var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
//dit laat zien in de console of de script is geladen.
console.log("");
console.log( "==========[" + filename + " | Was loaded on:" + datetime + "]==========");


if (sessionStorage.getItem("LoggedIn") == "true") {
    document.getElementById("getlog").disabled = false;
    document.getElementById("login").style.display = 'none';
    document.getElementById("LoginOverlay").style.display = 'none';
    document.getElementById("LogOut").style.display = 'block';
    document.getElementById("main").style.display = 'block';

    document.getElementById("EditUsers").disabled = false;
    if (sessionStorage.getItem('Prem') > 1){
        document.getElementById("EditUsers").onclick = function() {window.location.href = 'edit_userid.html'};
    }else{
        document.getElementById("EditUsers").onclick = function() {alert('U heeft niet de juiste rechten om gebruikers te bewerken.')};
    }



}else if (sessionStorage.getItem("LoggedIn") == "false" || sessionStorage.getItem("LoggedIn") == "unset") {
    document.getElementById("getlog").disabled = true;
    document.getElementById("login").style.display = 'block';
    document.getElementById("LoginOverlay").style.display = 'block';
    document.getElementById("LogOut").style.display = 'none';
    document.getElementById("main").style.display = 'none';


    document.getElementById("EditUsers").disabled = true;
    document.getElementById("EditUsers").onclick = function() {};

}


function Login() {
    $.ajax({
        url: 'media/php/validator.php',
        type: "POST",
        dataType: "json",
        data: {
            "User": document.getElementById('username').value,
            "Pass": document.getElementById('password').value
        },
        success: function (result) {

            sessionStorage.setItem('Prem', result['User']['Prem']);
            sessionStorage.setItem('Naam', result['User']['Naam']);
            Message(result);
        },
        error: function (result) {

            sessionStorage.setItem('LoggedIn', false);
            console.log(sessionStorage.getItem("LoggedIn"));
            console.log("Error with the validator, can't compare the username or password.");
            console.log(result);

        }
    });
}

function ExecReload(){

    location.reload();
    // console.log("TIME!!!");
}

function Message(result){

    if (result[0] == "Success"){
        var color = 'rgba(200, 255, 200, 0.75)'
        var message = result[1];
        var message2 = "Hallo " + result['User']['Naam'] + ",<br>De pagina zal na enkele seconde herladen.<br>Als de pagina niet herlaad klik dan <a href=''>Hier</a>";
        sessionStorage.setItem('LoggedIn', true);

        setTimeout(ExecReload, 3500);

    }else if (result[0] == "Failure"){
        sessionStorage.setItem('LoggedIn', false);
        color = 'rgba(255, 200, 200, 0.75)'
        var message = result[1];
    }else{
        sessionStorage.setItem('LoggedIn', 'unset');
        color = 'rgba(255, 200, 200, 0.75)';
        var message = "An invalid result got returned.";
    }


    $('#alert')
        .html(message)
        .css("background", color)
        .fadeIn("slow")
        .delay(2500)
        .fadeOut("slow")
        .queue( function(next){
            $(this)
                .css("background", 'rgba(255, 255, 150, 0.75)')
                .html("");
            next()
        })
    ;
    $('#even_wachten')
        .html(message2)
        .css("background", 'rgba(255, 255, 150, 0.75)')
        .fadeIn("slow")
    ;
}