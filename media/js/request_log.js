/*
    Auteur:         Jordy van Venrooij
    Controleur:     Gijs van Lokven
    Aanmaakdatum:   28-08-2018
    Bestandsnaam:*/
    var filename 	= 	'request_log.js'; //verander dit naar het bestands naam
    //neemt de huidige tijd
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    //dit laat zien in de console of de script is geladen.
    console.log("");
    console.log( "==========[" + filename + " | Is loaded on:" + datetime + "]==========");


// een function gemaakt om tijd af te ronden naar hele minuuuten
function Round_Time(time, increment, converted, direction) {
    if (converted == true){
        var time = moment(time, "HH:mm:ss");
    }else{
        time = moment(time);
    }
    var round_interval = increment;// how many minutes;
    var intervals = Math.floor(time.minutes() / round_interval);
    var minutesToRound = time.minutes() % round_interval;
    var minutesRounded = minutesToRound > round_interval / 2 ? round_interval : 0;
    var minutes = (intervals * round_interval + minutesRounded);

    if (direction == "Up"){
        // als mensen inloggen hoeft er niets te gebeuren
        time.minutes(minutes);
    }else if (direction == "Down"){
        // als mensen uitloggen moet de tijd naar beneden worden afgerond, dus halen we 15 min van d tijd af
        time.minutes((minutes - round_interval));
    }

    time.seconds(0);
    return time.format("HH:mm:ss");
}

    //genereer data naar een drop dow list
// De dropdown met de namen
var dropdown = document.getElementById('name_list');


if (sessionStorage.getItem("LoggedIn") == "true") {
    if (sessionStorage.getItem("Prem") > 1) {
// Populate dropdown with list of provinces
        $.ajax({
            url: 'media/php/attendance.php',
            type: "GET",
            dataType: "json",
            data: {
                "POPULATEDDL": "true",
                "NOTNULL": "true"
            },
            success: function (result) {
                for (var I = 0; result.length > I; I++) {
                    var opt = document.createElement('option');
                    opt.innerHTML = result[I].Naam;
                    opt.value = result[I].ID;
                    dropdown.appendChild(opt);

                }

                sessionStorage.setItem('CheckID', "All");
            }
        });

    }else{
        $.ajax({
            url: 'media/php/attendance.php',
            type: "GET",
            dataType: "json",
            data: {
                "POPULATEDDL": "true",
                "NOTNULL": "true",
                "WHERE": sessionStorage.getItem("Naam")
            },
            success: function (result) {
                for (var I = 0; result.length > I; I++) {
                    var opt = document.createElement('option');
                    opt.innerHTML = result[I].Naam;
                    opt.value = result[I].ID;
                    dropdown.appendChild(opt);

                    sessionStorage.setItem('CheckID', result[I].ID);
                }
            }
        });
    }
} else {
    var opt = document.createElement('option');
    opt.innerHTML = "Log eerst in!";
    dropdown.appendChild(opt);
}


// De dropdown met de weeken
var dropdown2 = document.getElementById('week_list');

// genereer weeknummers
for(var I = 1; I <= 52; I++){
	var opt1 = document.createElement('option');
    opt1.innerHTML = I;
    opt1.value = I - 1;
    dropdown2.append(opt1);

    // vraag huidig weeknummer op
    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };
    var myDate = new Date();
    // Selecteer het huidig weeknummer in de ddl
    dropdown2.selectedIndex = myDate.getWeek() - 1;
}

// De dropdown met de jaaren
var dropdown3 = document.getElementById('jaar_list');
var Cur_year = new Date().getFullYear();

// genereer weeknummers
for(var I = 2018; I <= Cur_year; I++){
    var opt2 = document.createElement('option');
    opt2.innerHTML = I;
    opt2.value = I;
    dropdown3.prepend(opt2);

    // Selecteer het huidig jaar in de ddl
    dropdown3.selectedIndex = "0";
}


function GenBewerkAction(logID, opmerking){

    // maakt de textbox 'opmerking-text' leeg
    var id = "#opmerking" + logID;

    if (opmerking == null || opmerking == "" || opmerking == " "){
        opmerking = null;
        document.getElementById("opmerking-text").value = null;
    }else {
        //convert de quotes van  ;quote; terug naar ' of "
        opmerking = opmerking.replace(/;q1;/g, "'");
        opmerking = opmerking.replace(/;q2;/g, "\"");

        document.getElementById("opmerking-text").value = opmerking;
    }

    //verwijder de onclick
    document.getElementById("bewerk_button").onclick = null;

    // geef de knop een onclick
    document.getElementById('bewerk_button').setAttribute('onclick','onclickcode('+logID+')');
}

//een functie die wordt uitgevoerd waneer je een opmerking wilt bewerken
function onclickcode(logID){
    document.getElementById("overlay").style.display = "none";
    Opmerking(logID);
}


// De dropdown met de weeken
function GetLog() {
    var CheckID = sessionStorage.getItem('CheckID');
    if (CheckID === document.getElementById('name_list').options[document.getElementById("name_list").selectedIndex].value || CheckID === "All" ) {
        // update #Last_Request
        var Request_Date = new Date();
        // maak last request datum
        var dd = Request_Date.getDate();
        var mm = Request_Date.getMonth() + 1; //January is 0
        var HH = Request_Date.getHours();
        var MM = Request_Date.getMinutes();
        var SS = Request_Date.getSeconds();
        var yyyy = Request_Date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        //time
        if (HH < 10) {
            HH = '0' + HH;
        }
        if (MM < 10) {
            MM = '0' + MM;
        }
        if (SS < 10) {
            SS = '0' + SS;
        }

        Request_Timestamp = 'Datum & tijd van aanvraag: ' + dd + '/' + mm + '/' + yyyy + ' - ' + HH + ':' + MM + ':' + SS;

        document.getElementById("Last_Request").innerHTML = Request_Timestamp;

        //krijg het ID
        const name = document.getElementById("name_list");
        var name_ID = "'" + name.options[name.selectedIndex].value + "'";

        //krijg het week nummer
        const week = document.getElementById("week_list");
        var week_ID = week.options[week.selectedIndex].value;

        //krijg het jaar nummer
        const jaar = document.getElementById("jaar_list");
        var jaar_ID = jaar.options[jaar.selectedIndex].value;

        const table = document.getElementById('Log');
        var html = "<tr><th>Binnekomst</th><th>Vertrek</th><th>Opmerking</th><th>Gewerkte tijd</th><th>Overuuren</th></tr>";

        $.ajax({
            url: 'media/php/attendance.php',
            type: "GET",
            dataType: "json",
            data: {
                "NAME": name_ID,
                "DATE": week_ID,
                "YEAR": jaar_ID
            },
            success: function (result) {
                $("#Log tr").remove();
                if (result != null) {
                    if (result.length > 0) {
                        for (var I = 0; result.length > I; I++) {

                            var Log_In = new Date(result[I].log_in);
                            var Log_Uit = new Date(result[I].log_uit);


                            // rond de tijden af naar boven met hele kwartieren
                            var Log_In_Round = Round_Time(Log_In, 15, true, "Up");
                            var Log_In_Timestamp_Round = Log_In.toDateString() + " - " + Log_In_Round;
                            // maak er een datum van die makkelijk te lezen is
                            var Log_In_Timestamp_Round_RealDate = new Date(Log_In.toDateString() + " " + Log_In_Round);
                            // maak een datum aan die door javascript te lezen in waardoor ze te vergelijken zijn
                            var Log_In_Round_Raw = (moment(Log_In_Round, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'));

                            // rond de tijden af naar beneden met hele kwartieren
                            var Log_Uit_Round = Round_Time(Log_Uit, 15, true, "Down");
                            // maak er een datum van die makkelijk te lezen is
                            var Log_Uit_Timestamp_Round = Log_Uit.toDateString() + " - " + Log_Uit_Round;
                            // maak een datum aan die door javascript te lezen in waardoor ze te vergelijken zijn
                            var Log_Uit_Timestamp_Round_RealDate = new Date(Log_Uit.toDateString() + " " + Log_Uit_Round);
                            var Log_Uit_Round_Raw = (moment(Log_Uit_Round, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'));


                            if (Log_In_Round != Log_Uit_Round) {
                                if (Log_In_Round < Log_Uit_Round) {

                                    // bereken gewerkte tijden
                                    var totaal_tijd_raw = (Log_Uit_Round_Raw - Log_In_Round_Raw) - 3600; // bvb 17:15 - 08:15 = 9 - 1 = 8

                                    var totaal_tijd = moment().startOf('day')
                                        .seconds(totaal_tijd_raw)
                                        .format('HH:mm:ss');


                                    //bereken overuuren
                                    if (totaal_tijd_raw > 28800) { // 28800 = 8 uur | als je over gewerkt hebt

                                        var totaal = (totaal_tijd_raw - 28800); // totaal_tijd - 8 uur = (24 - teweinig gewerkte tijd)
                                        var overtijd = (totaal);


                                        var overuuren = moment().startOf('day')
                                            .seconds(overtijd)
                                            .format('HH:mm:ss');

                                    }
                                    else if (totaal_tijd_raw < 28800) { // 28800 = 8 uur | als je te weinig gewerkt hebt


                                        overuuren = 28800 - totaal_tijd_raw;

                                        overuuren = "- " + moment()
                                            .startOf('day')
                                            .seconds(overuuren) // 28800 = 8 uur
                                            .format('HH:mm:ss');

                                    }
                                    else { //als je 8 uur gewerkt hebt
                                        overuuren = "-";
                                    }
                                    if ((Log_Uit_Round_Raw - Log_In_Round_Raw) < 3600) {
                                        totaal_tijd = "< 1uur";
                                        overuuren = "X";
                                    }
                                } else {
                                    totaal_tijd = "X";
                                    overuuren = "X";
                                }
                            } else {
                                totaal_tijd = "X";
                                overuuren = "X";
                            }


                            //Genereer de table
                            // begin table row
                            html = html + "<tr>";

                            if (Log_In_Timestamp_Round_RealDate < Log_Uit_Timestamp_Round_RealDate) { // cel 1&2 (Login tijd / Loguit tijd)

                                html = html + "<td>" + Log_In_Timestamp_Round + "</td><td>" + Log_Uit_Timestamp_Round + "</td>";

                            } else if (Log_In_Timestamp_Round_RealDate > Log_Uit_Timestamp_Round_RealDate) {

                                html = html + "<td>" + Log_In_Timestamp_Round + "</td><td>Niet uitgelogd!</td>";

                            } else {

                                html = html + "<td colspan='2'>Er ging iets fout met het krijgen van de tijden!</td>";

                            }


                            // cel 3 (Opmerking)
                            if (result[I].Opmerking != null && result[I].Opmerking != "") {

                                //haal alle new lines(Witregels) en tabs uit de tekst
                                var OpmerkingNew = result[I].Opmerking.replace(/(\r\n|\n|\r)/gm, " ");

                                //convert de quotes van  ;quote; terug naar ' of "
                                var OpmerkingNew2 = OpmerkingNew.replace(/;q1;/g, "'");
                                OpmerkingNew2 = OpmerkingNew2.replace(/;q2;/g, "\"");

                                html = html + "<td><p id='opmerking" + result[I].log_id + "'>" + OpmerkingNew2 + "</p><button id='bewerken2' value='' onclick='document.getElementById(\"overlay\").style.display = \"unset\";GenBewerkAction(" + result[I].log_id + ", \"" + OpmerkingNew + "\");'>bewerken</button></td>";
                            } else {

                                html = html + "<td><p id='opmerking" + result[I].log_id + "'>*Geen opmerking*</p><button id='bewerken2' value='' onclick='document.getElementById(\"overlay\").style.display = \"unset\";GenBewerkAction(" + result[I].log_id + ", \"\");'>bewerken</button></td>";
                            }

                            // cel 4 (Totaal gewerkte tijd)
                            html = html + "<td>" + totaal_tijd + "</td>";
                            // cel 5 (Overuuren)
                            html = html + "<td id='Overuuren" + I + "'>" + overuuren + "</td>";
                            // sluit de table ow af
                            html = html + "</tr>"

                            // Schrijf HTML naar de table
                            table.innerHTML = html;

                        }
                        for (var I = 0; result.length > I; I++) {
                            Check_Values(I);
                        }
                    } else {
                        // Schrijf HTML naar de table
                        table.innerHTML = html;

                        cosole.log(html);
                    }
                } else {
                    table.innerHTML = html + "<tr><td colspan='5' style='text-align: center'>Geen data</td></tr>";
                }

                var sel_year = document.getElementById("jaar_list").options[document.getElementById("jaar_list").selectedIndex].value;
                var sel_week = document.getElementById("week_list").options[document.getElementById("week_list").selectedIndex].value + 1;

// plaats de start datum van de week
                var d = (1 + (week_ID) * 7); // 1st of January + 7 days for each week
                var start_date = new Date(jaar_ID, 0, d);

// plaats de eind datum van de week
                var end_date = new Date(start_date);
                end_date.setDate(end_date.getDate() + 6);


                //plaats de eind datum
                var dd = end_date.getDate();
                var mm = end_date.getMonth() + 1; //January is 0
                var yyyy = end_date.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                end_date = dd + '/' + mm + '/' + yyyy;
                document.getElementById("datum_eind").innerHTML = end_date;


                //plaats de start datum
                dd = start_date.getDate();
                mm = start_date.getMonth() + 1; //January is 0
                yyyy = start_date.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                start_date = dd + '/' + mm + '/' + yyyy;
                document.getElementById("datum_start").innerHTML = start_date;

            }
        });
    }else{
        alert("Error!\n" +
            "\nSession expired." +
            "\nPlease reload the page.");
    }
}


function Check_Values(I){
    var Overval = document.getElementById('Overuuren'+I);
    if ( Overval.innerHTML.match(/- /g)) {
        Overval.style.backgroundColor="lightcoral";
    }else if (Overval.innerHTML.match(/X/g)){
        Overval.style.backgroundColor="yellow";
    }else if (!Overval.innerHTML.match(/-/g)){
        Overval.style.backgroundColor="lightgreen";
    }
}

function Opmerking(logID) {
    var opmerking_text = document.getElementById("opmerking-text").value;

    //convert de quotes van ' of " naar ;quote;
    opmerking_text = opmerking_text.replace(/\'/g, ";q1;");
    opmerking_text = opmerking_text.replace(/\"/g, ";q2;");

    $.ajax({
        url: 'media/php/attendance.php',
        type: "GET",
        dataType: "json",
        data: {
        	"logID": logID,
            "Opmerking": opmerking_text
		},
        success: function() {

        }
    });
    GetLog();
}

