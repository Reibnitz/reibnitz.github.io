const historicoStorage = localStorage.getItem("historicoString");
if (historicoStorage == null) {
    var jogosJogados = 0;
    var jogosVencidos = 0;
    var percentual = 0;
    var seqAtual = 0;
    var seqHistorico = [];
    var seqMelhor = 0;
    var um = 0;
    var ds = 0;
    var ts = 0;
    var qo = 0;
    var co = 0;
    var ss = 0;
    var falhas = 0;
    document.querySelector("#explicacao").className = "";
} else {
    const historicoObj = JSON.parse(localStorage.getItem("historicoString"));
    jogosJogados = historicoObj.jogosJogados;
    jogosVencidos = historicoObj.jogosVencidos;
    percentual = historicoObj.percentual;
    seqAtual = historicoObj.seqAtual;
    seqHistorico = historicoObj.seqHistorico;
    seqMelhor = historicoObj.seqMelhor;
    um = historicoObj.tentativas[1];
    ds = historicoObj.tentativas[2];
    ts = historicoObj.tentativas[3];
    qo = historicoObj.tentativas[4];
    co = historicoObj.tentativas[5];
    ss = historicoObj.tentativas[6];
    falhas = historicoObj.tentativas["f"];
}

function verificarPalpite() {
    let palpite = gerarPalpite().toLowerCase();

    if (listaSemAcento.includes(palpite)) {
        alterarCores();
        atualizarDiario();
        voltarAcentos();

        if (palpite.toUpperCase() != palavra && i + j == 10){
            let mensagem = document.querySelector("#mensagem");
            mensagem.innerText = sorteio.toUpperCase();
            mensagem.className = "";
        }
        
        if (palpite.toUpperCase() == palavra || i + j == 10) {
            atualizarHistorico();
            imprimirHistorico();
            setTimeout(function(){
                const popup = document.querySelector("#resultado");
                popup.classList.remove("escondida");
            }, 1000)
        }else {
            i++;
            j = 0;
        }
    } else {
        let mensagem = document.querySelector("#mensagem");
        mensagem.innerText = "Palavra inválida";
        mensagem.className = "";

        setTimeout(function(){
            mensagem.className = "invisivel";
        },2000);

        for (x of linhas[i]) {
            x.parentElement.classList.add("animado");
        }
        setTimeout(function(){
            for (x of linhas[i]) {
                x.parentElement.classList.remove("animado")
            }
        }, 100);
        }
}

function gerarPalpite() {
    let palpite = '';    

    for (x of linhas[i]) {
        palpite += x.innerText;
    }
    return palpite;
}

function alterarCores() {
    let palpite = gerarPalpite();

    let letrasUsadas = [];
    let n = 0;
    for (x of palpite) { // verificar verde
        if (x == palavra[n]) {
            linhas[i][n].parentElement.classList.add("verde");
            document.querySelector(`#${linhas[i][n].innerText}`).classList.add("botao-verde");
            letrasUsadas.push(x);
        } else if(!palavra.includes(x)) {
            linhas[i][n].parentElement.classList.add("cinza");
            document.querySelector(`#${linhas[i][n].innerText}`).classList.add("botao-cinza");
        }
        n++
    }

    n = 0;
    for (x of palpite) { // verificar amarelo
        let duplicatasPalpite = verificarDuplicatas(x, palavra, letrasUsadas);

        if (palavra.includes(x) && duplicatasPalpite>0 && !linhas[i][n].parentElement.classList.contains("verde")) {
            linhas[i][n].parentElement.classList.add("amarelo")
            document.querySelector(`#${linhas[i][n].innerText}`).classList.add("botao-amarelo");
            letrasUsadas.push(x);
        } else if(duplicatasPalpite<=0
                && !linhas[i][n].parentElement.classList.contains("amarelo")
                && !linhas[i][n].parentElement.classList.contains("verde")) {
            linhas[i][n].parentElement.classList.add("cinza");
            document.querySelector(`#${linhas[i][n].innerText}`).classList.add("botao-cinza");
        }
        n++
    }
}

function verificarDuplicatas(letra, palavra, letrasUsadas) {
    let contaDuplicatas = 0;

    for (y of palavra) {
        if (y == letra) {
            contaDuplicatas++;
        }
    }

    for (y of letrasUsadas) {
        if (letrasUsadas.length>0 && y == letra){
            contaDuplicatas--;
        }
    }

    return contaDuplicatas;
}

function atualizarHistorico() {
    let palpite = gerarPalpite().toLowerCase();
    jogosJogados++;

    if (palpite == sorteio){
        jogosVencidos++;
        seqAtual++;

        if (i == 0) {um++};
        if (i == 1) {ds++};
        if (i == 2) {ts++};
        if (i == 3) {qo++};
        if (i == 4) {co++};
        if (i == 5) {ss++};

        if (seqMelhor <= seqAtual) {
            seqMelhor = seqAtual;
        } else {
            seqMelhor++; // VERIFICAR
        }
    } else {
        seqHistorico.push(seqAtual);
        seqAtual = 0;
        falhas++
        for (x of seqHistorico) {
            if (x > seqMelhor) {
                seqMelhor = x;
            }
        }
    }

    percentual = jogosVencidos * 100 / jogosJogados;
    

    const historico = {
        "jogosJogados" : jogosJogados,
        "jogosVencidos" : jogosVencidos,
        "percentual" : percentual,
        "seqAtual" : seqAtual,
        "seqHistorico" : seqHistorico,
        "seqMelhor" : seqMelhor,
        "tentativas" : {
            "1" : um,
            "2" : ds,
            "3" : ts,
            "4" : qo,
            "5" : co,
            "6" : ss,
            "f" : falhas
        }
    }

    localStorage.setItem("historicoString", JSON.stringify(historico));
}

function imprimirHistorico() {
    let palpite = gerarPalpite().toLowerCase();

    const historicoObj = JSON.parse(localStorage.getItem("historicoString"));

    document.querySelector("#jogos").innerText = historicoObj.jogosJogados;
    document.querySelector("#vitorias").innerText = historicoObj.jogosVencidos;
    document.querySelector("#seq-atual").innerText = historicoObj.seqAtual;
    document.querySelector("#mel-seq").innerText = historicoObj.seqMelhor;

    if (palpite != sorteio) {
        document.querySelector("#falhas-barra").style.background = "#60dd60";
    } else {
        document.querySelector(`#t${i+1}-barra`).style.background = "#60dd60";
    }

    document.querySelector("#t1-barra").style.flex = historicoObj.tentativas[1] / historicoObj.jogosJogados;
    document.querySelector("#t2-barra").style.flex = historicoObj.tentativas[2] / historicoObj.jogosJogados;
    document.querySelector("#t3-barra").style.flex = historicoObj.tentativas[3] / historicoObj.jogosJogados;
    document.querySelector("#t4-barra").style.flex = historicoObj.tentativas[4] / historicoObj.jogosJogados;
    document.querySelector("#t5-barra").style.flex = historicoObj.tentativas[5] / historicoObj.jogosJogados;
    document.querySelector("#t6-barra").style.flex = historicoObj.tentativas[6] / historicoObj.jogosJogados;
    document.querySelector("#falhas-barra").style.flex = historicoObj.tentativas["f"] / historicoObj.jogosJogados;

    document.querySelector("#t1-texto").innerText = historicoObj.tentativas[1];
    document.querySelector("#t2-texto").innerText = historicoObj.tentativas[2];
    document.querySelector("#t3-texto").innerText = historicoObj.tentativas[3];
    document.querySelector("#t4-texto").innerText = historicoObj.tentativas[4];
    document.querySelector("#t5-texto").innerText = historicoObj.tentativas[5];
    document.querySelector("#t6-texto").innerText = historicoObj.tentativas[6];
    document.querySelector("#falhas-texto").innerText = historicoObj.tentativas["f"];
}

setInterval(function(){
    const hoje = new Date();
    const objAmanha = {
        "ano" : new Date(hoje.valueOf()+86400000).getFullYear(),
        "mes" : new Date(hoje.valueOf()+86400000).getMonth(),
        "dia" : new Date(hoje.valueOf()+86400000).getDate()
    };
    const amanha = new Date(objAmanha.ano, objAmanha.mes, objAmanha.dia);
    const diferenca = amanha.valueOf() - hoje.valueOf();
    let horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    let segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
    
    horas = (horas < 10) ? "0"+horas : horas;
    minutos = (minutos < 10) ? "0"+minutos : minutos;
    segundos = (segundos < 10) ? "0"+segundos : segundos;

    const timer = document.querySelector("#timer");
    timer.innerText = `${horas}:${minutos}:${segundos}`;
}, 1000)

function compartilhar (){
    let palpite = gerarPalpite();
    const arrEmojis = linhas.map(function(linha) {
        return linha.map(function(celula) {
            if (celula.parentElement.classList.contains("verde")) {
                return "&#129001;"
            } else if (celula.parentElement.classList.contains("amarelo")) {
                return "&#129000;"
            } else if (celula.parentElement.classList.contains("cinza")) {
                return "&#11036;"
            } else {return ""}
        })
    });

    let contador = 0;
    const emojis = document.querySelector("#clipboard");
    let texto = "";
    let nroTentativas = 0;
    for (linha of arrEmojis) {
        for (celula of linha) {
            if (celula != "") {
                if ((contador) % 5 == 0 && contador != 0){
                    texto += `<br> ${celula}`
                } else {
                    texto += celula;
                }
                contador++
                nroTentativas = contador / 5;
            }
        }
    }
    if (palpite.toLowerCase() != sorteio) {nroTentativas = "☠️"}
    
    emojis.innerHTML = `Joguei Wordnitz #${palavrasSorteaveis.indexOf(sorteio)+896}! ${nroTentativas}/6<br>${texto}<br>Jogue em https://reibnitz.github.io/`;
    //navigator.clipboard.writeText(emojis.innerText);
    //
    if (mobileCheck()) {
        navigator.share({
            text: emojis.innerText
        });
    } else {
        navigator.clipboard.writeText(emojis.innerText);
        mensagem.innerText = "Texto copiado";
        mensagem.className = "";
        setTimeout(function(){
        mensagem.className = "invisivel";
        },2000);
    }
    
    emojis.innerHTML = "";
}

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

document.querySelector("#container-share").addEventListener("click", compartilhar);

function fecharJanela () {
    document.querySelector("#resultado").className = "escondida";
    document.querySelector("#explicacao").className = "escondida";
}

document.querySelector("#fechar-stats").addEventListener("click", fecharJanela);

document.querySelector("#fechar-explicacao").addEventListener("click", fecharJanela);
document.querySelector("#abrir-explicacao").addEventListener("click", function(){
    document.querySelector("#explicacao").className = "";
});

document.querySelector("#stats").addEventListener("click",function(){
    imprimirHistorico();
    document.querySelector("#resultado").className = "";
});

//TENTANDO FAZER O LOCAL STORAGE PARA PALPITES JÁ REALIZADOS


if (localStorage.getItem("diarioString") == null){
    diaHoje = Math.trunc((data.valueOf() - 10800000) / 86400000);
} else {
    const registroDiarioObj = JSON.parse(localStorage.getItem("diarioString"));
    diaHoje = Math.trunc((data.valueOf() - 10800000) / 86400000);

    if (Math.floor(Math.trunc((data.valueOf() - 10800000)/86400000) > registroDiarioObj.dia)){
        localStorage.removeItem("dia")
        localStorage.removeItem("primeiroPalpite")
        localStorage.removeItem("primeiroPalpiteClasse")
        localStorage.removeItem("segundoPalpite")
        localStorage.removeItem("segundoPalpiteClasse")
        localStorage.removeItem("terceiroPalpite")
        localStorage.removeItem("terceiroPalpiteClasse")
        localStorage.removeItem("quartoPalpite")
        localStorage.removeItem("quartoPalpiteClasse")
        localStorage.removeItem("quintoPalpite")
        localStorage.removeItem("quintoPalpiteClasse")
        localStorage.removeItem("sextoPalpite")
        localStorage.removeItem("sextoPalpiteClasse")
    } else {
        for (let x = 0; x < registroDiarioObj.primeiroPalpite.length; x++){
            linhas[0][x].innerHTML = registroDiarioObj.primeiroPalpite[x];
            for (y in registroDiarioObj.primeiroPalpiteClasse[x]){
                linhas[0][x].parentElement.classList.add(registroDiarioObj.primeiroPalpiteClasse[x][y]);
            }
        }
        for (let x = 0; x < registroDiarioObj.segundoPalpite.length; x++){
            linhas[1][x].innerHTML = registroDiarioObj.segundoPalpite[x];
            for (y in registroDiarioObj.segundoPalpiteClasse[x]){
                linhas[1][x].parentElement.classList.add(registroDiarioObj.segundoPalpiteClasse[x][y]);
            }
        }
        for (let x = 0; x < registroDiarioObj.terceiroPalpite.length; x++){
            linhas[2][x].innerHTML = registroDiarioObj.terceiroPalpite[x];
            for (y in registroDiarioObj.terceiroPalpiteClasse[x]){
                linhas[2][x].parentElement.classList.add(registroDiarioObj.terceiroPalpiteClasse[x][y]);
            }
        }
        for (let x = 0; x < registroDiarioObj.quartoPalpite.length; x++){
            linhas[3][x].innerHTML = registroDiarioObj.quartoPalpite[x];
            for (y in registroDiarioObj.quartoPalpiteClasse[x]){
                linhas[3][x].parentElement.classList.add(registroDiarioObj.quartoPalpiteClasse[x][y]);
            }
        }
        for (let x = 0; x < registroDiarioObj.quintoPalpite.length; x++){
            linhas[4][x].innerHTML = registroDiarioObj.quintoPalpite[x];
            for (y in registroDiarioObj.quintoPalpiteClasse[x]){
                linhas[4][x].parentElement.classList.add(registroDiarioObj.quintoPalpiteClasse[x][y]);
            }
        }
        for (let x = 0; x < registroDiarioObj.sextoPalpite.length; x++){
            linhas[5][x].innerHTML = registroDiarioObj.sextoPalpite[x];
            for (y in registroDiarioObj.sextoPalpiteClasse[x]){
                linhas[5][x].parentElement.classList.add(registroDiarioObj.sextoPalpiteClasse[x][y]);
            }
        }
    }

}

function atualizarDiario(){
    diaHoje = Math.trunc((data.valueOf() - 10800000) / 86400000);

    primeiroPalpite = linhas[0].map((x)=>{return x.innerHTML});
    primeiroPalpiteClasse = linhas[0].map((x)=>{return x.parentElement.classList});

    segundoPalpite = linhas[1].map((x)=>{return x.innerHTML});
    segundoPalpiteClasse = linhas[1].map((x)=>{return x.parentElement.classList});

    terceiroPalpite = linhas[2].map((x)=>{return x.innerHTML});
    terceiroPalpiteClasse = linhas[2].map((x)=>{return x.parentElement.classList});

    quartoPalpite = linhas[3].map((x)=>{return x.innerHTML});
    quartoPalpiteClasse = linhas[3].map((x)=>{return x.parentElement.classList});

    quintoPalpite = linhas[4].map((x)=>{return x.innerHTML});
    quintoPalpiteClasse = linhas[4].map((x)=>{return x.parentElement.classList});

    sextoPalpite = linhas[5].map((x)=>{return x.innerHTML});
    sextoPalpiteClasse = linhas[5].map((x)=>{return x.parentElement.classList});

    const registroDiario = {
        "dia" : diaHoje,
        "primeiroPalpite" : primeiroPalpite,
        "primeiroPalpiteClasse" : primeiroPalpiteClasse,
        "segundoPalpite" : segundoPalpite,
        "segundoPalpiteClasse" : segundoPalpiteClasse,
        "terceiroPalpite" : terceiroPalpite,
        "terceiroPalpiteClasse" : terceiroPalpiteClasse,
        "quartoPalpite" : quartoPalpite,
        "quartoPalpiteClasse" : quartoPalpiteClasse,
        "quintoPalpite" : quintoPalpite,
        "quintoPalpiteClasse" : quintoPalpiteClasse,
        "sextoPalpite" : sextoPalpite,
        "sextoPalpiteClasse" : sextoPalpiteClasse
    }    
    localStorage.setItem("diarioString", JSON.stringify(registroDiario));
}

let conteudo = linhas.map((linha)=> {
    return linha.map((x) => {
        return x.innerHTML
    });
});

let indiceVazio = [];
for (linha of conteudo) {
    for (item of linha) {
        if (item == "") {
            indiceVazio.push(conteudo.indexOf(linha));
            break
        }
    }
}
const linhaDestaque = Math.min(...indiceVazio)

i = linhaDestaque;
