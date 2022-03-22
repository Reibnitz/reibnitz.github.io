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
        voltarAcentos();
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
    let palpite = gerarPalpite();
    
    jogosJogados++;

    if (palpite.toUpperCase() == palavra){
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
    let palpite = gerarPalpite();
    const historicoObj = JSON.parse(localStorage.getItem("historicoString"));

    document.querySelector("#jogos").innerText = historicoObj.jogosJogados;
    document.querySelector("#vitorias").innerText = historicoObj.jogosVencidos;
    document.querySelector("#seq-atual").innerText = historicoObj.seqAtual;
    document.querySelector("#mel-seq").innerText = historicoObj.seqMelhor;

    if (palpite != palavra) {
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
    if (palpite != palavra) {nroTentativas = "*"}
    
    emojis.innerHTML = `Joguei Wordnitz #${palavrasSorteaveis.indexOf(sorteio)+1}! ${nroTentativas}/6<br>` + texto;
    navigator.clipboard.writeText(emojis.innerText);
    emojis.innerHTML = "";
}

document.querySelector("#container-share").addEventListener("click", compartilhar);

function fecharResultado () {
    document.querySelector("#resultado").className = "escondida";
}

document.querySelector("#fechar").addEventListener("click", fecharResultado);
document.querySelector("#stats").addEventListener("click",function(){
    imprimirHistorico();
    document.querySelector("#resultado").className = "";
})