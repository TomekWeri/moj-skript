javascript: if(!army_counter) var army_counter={}; var tabulka; var sumArmy = []; var defaultRow = '0'; army_counter.link = "/game.php?&village="+game_data.village.id+"&type=complete&mode=units&group=0&page=-1&screen=overview_villages"; if(game_data.player.sitter != 0)     army_counter.link="/game.php?t=" + game_data.player.id + "&village="+game_data.village.id+"&type=complete&mode=units&group=0&page=-1&screen=overview_villages"; army_counter.downloadedGrupy = false; army_counter.images = "oštep,meč,sekera,lukostrelec,špión,svetlo,pochodník,ťažký,baranidlo,katapult,rytier,snob".split(","); army_counter.namesUnits = "Oštepár,Mečiar,Sekerník,Lukostrelec,Špión,Ľahká jazda,Pochodník,Ťažká jazda,Baranidlo,Katapult,Rytier,Šľachtic".split(","); var okno = "<h2 align='center'>Stav armády</h2><table width='100%'><tr><th>Skupina: <select id='listaGrup' onchange=\"army_counter.link = this.value; getData();\"><option value='"+army_counter.link+"'>Všetky</select>"; okno += "<tr><td><table width='100%'><tr><th colspan='4'>Typ: <select onchange=\"change(this.value);\"><option value='0'>Dostupné jednotky<option value='0p2p3'>Všetky vlastné<option value='1'>V dedinách<option value='1m0'>Len podpora<option value='2'>Odoslaná podpora<option value='3'>Na ceste</select><tbody id='dostupne_wojska'></table><tr><th><b id='pocet_dedin'></b><a href='#' style='float: right;' onclick=\"exportData();\">Exportovať</a></table>"; Dialog.show("okno_spravy", okno); getData(); void 0; 
function exportData(){     if(!$("#dostupne_wojska").html().match("textarea"))         $("#dostupne_wojska").html(army_counter.export);     else	         change(defaultRow); } 
function getData(){     $("#pocet_dedin").html("Počkajte...");     $(mobil?'#loading':'#loading_content').show();     var r;     r = new XMLHttpRequest();     r.open('GET', army_counter.link, true);     function processResponse(){         if (r.readyState == 4 && r.status == 200) {             var requestedBody = document.createElement("body");             requestedBody.innerHTML = r.responseText;             tabulka = $(requestedBody).find('#units_table').get()[0];             if(!tabulka){                 $("#dostupne_wojska").html("Vybratá skupina nemá žiadne dediny. <br>Vyberte inú.");                 $("#pocet_dedin").html("chyba");                 return false;            }             var skupiny = $(requestedBody).find('.vis_item').get()[0].getElementsByTagName(mobil?'option':'a');             if(tabulka.rows.length > 1000) alert("Poznámka\nSčítam len prvých 1000 dedín");             if(!army_counter.downloadedGrupy){                for(i=0; i<skupiny.length; i++){                     var meno = skupiny[i].textContent;                     if(mobil && skupiny[i].textContent == "Všetky") continue;                     $("#listaGrup").append($('<option>', {                         value: skupiny[i].getAttribute(mobil ? "value" : "href")+"&page=-1",                         text: mobil ? meno : meno.slice(1, meno.length - 1)                     }));	                 }                 army_counter.downloadedGrupy = true;                 if(!tabulka.rows[0].innerHTML.match("lukostrelec")){                     army_counter.images.splice(army_counter.images.indexOf("lukostrelec"), 1);                     army_counter.namesUnits.splice(army_counter.namesUnits.indexOf("Lukostrelec"), 1);                 }                 if(!tabulka.rows[0].innerHTML.match("rytier"))                     army_counter.images.splice(army_counter.images.indexOf("rytier"), 1);             }             suma();             change(defaultRow);         }     }     r.onreadystatechange = processResponse;     r.send(null); } 
function change(text){     defaultRow = text;     var ktore = String(text).match(/\d+/g);     var coRobit = String(text).match(/[az]/g);     var novaSuma = [];     for(j=0; j<army_counter.images.length; j++)         novaSuma[j] = 0;     for(i=0; i<ktore.length; i++)         if(i==0 || coRobit[i-1]=="p")             novaSuma = add(novaSuma, sumArmy[ktore[i]]);         else             novaSuma = subtract(novaSuma, sumArmy[ktore[i]]);     output(novaSuma); } 
function suma(){     for(i=0; i<5; i++){         sumArmy[i] = [];         for(j=0; j<army_counter.images.length; j++)             sumArmy[i][j] = 0;     }     for(var i=1; i<tabulka.rows.length; i++){         var m = (tabulka.rows[1].cells.length == tabulka.rows[i].cells.length) ? 2 : 1;         for(var j=m; j<army_counter.images.length+m; j++){             sumArmy[(i-1)%5][j-m] += parseInt(tabulka.rows[i].cells[j].textContent);         }     } } 
function subtract(sumArmy1, sumArmy2){     var result = [];     for(k=0; k<army_counter.images.length; k++)         result[k] = sumArmy1[k] - sumArmy2[k];     return result; } 
function add(sumArmy1, sumArmy2){     var result = [];     for(k=0; k<army_counter.images.length; k++)         result[k] = sumArmy1[k] + sumArmy2[k];     return result; } 
function drawSpaces(count){     var text = String(count);     var result = "";     for(j=0; j<(10-text.length); j++)         result += "\u2007";     return result; }
function output(sumArmyToOutput){     var elem = "<tr>";     army_counter.export = "<textarea rows='7' cols='25' onclick=\"this.select();\">";     for(i=0; i<army_counter.images.length; i++){         army_counter.export += "[jednotka]"+army_counter.images[i]+"[/jednotka]"+sumArmyToOutput[i]+(i%2==0 ? drawSpaces(sumArmyToOutput[i]) : "\n");         elem += (i%2==0 ? "<tr>" : "") + "<th width='20'><a href='https://help.plemiona.pl/wiki/Jednotky#" + army_counter.namesUnits[i] + "' target='_blank'><img src='"+image_base + "unit/unit_" + army_counter.images[i] + ".png'></a><td bgcolor='#fff5da'>"+sumArmyToOutput[i];     }     army_counter.export += "</textarea>";     $("#dostupne_wojska").html(elem);     $(mobil ? '#loading' : '#loading_content').hide();     $("#pocet_dedin").html("Súčet "+((tabulka.rows.length-1)/5)+" dediny"); }
