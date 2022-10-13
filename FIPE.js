
//Função AJAX
function xhttpAssincrono(callBackFunction, params) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            // Chama a função em callback e passa a resposta da requisição
            callBackFunction(this.responseText);
        }
    };
    // Path completo para a requisição AJAX.
    var url = "https://parallelum.com.br/fipe/api/v1/carros/marcas";
    if(params != null){
        url = url + params;   
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

var marcasJSON;
function callBackFunctionMarcasJSON(e){
    marcasJSON = JSON.parse(e);
}

var modelosJSON;
function callBackFunctionModelosJSON(e){
    modelosJSON = JSON.parse(e);
}

var anosJSON;
function callBackFunctionAnosJSON(e){
    anosJSON = JSON.parse(e);
}

var precoJSON;
function callBackFunctionPrecoJSON(e){
    precoJSON = JSON.parse(e);
    console.log(precoJSON);
}

xhttpAssincrono(callBackFunctionMarcasJSON);

var elementoSeletorMarca = document.getElementById("seletorMarca");
var elementoSeletorModelo = document.getElementById("seletorModelo");
var elementoSeletorAno = document.getElementById("seletorAno");
var valorTabela = document.getElementById("valorTabela");
var marcaTabela = document.getElementById("marcaTabela");
var modeloTabela = document.getElementById("modeloTabela");
var anoTabela = document.getElementById("anoTabela");
var combustivelTabela = document.getElementById("combustivelTabela");
var mesRefTabela = document.getElementById("mesReferenciaTabela");
var codFipeTabela = document.getElementById("codigoFipeTabela");
var tabela = document.getElementById("tabela");
var botaoFavoritos = document.getElementById("botaoFavoritos");
var listaFavoritos = document.getElementById("listaFavoritos");

function popularSeletorMarca(){
    try{
        var marca;
        var marcaID;
        for (let index = 0; index < marcasJSON.length; index++) {
            marca = marcasJSON[index].nome;
            marcaID = marcasJSON[index].codigo;
            var opcao = document.createElement("option");
            opcao.setAttribute("value", marcaID);
            opcao.innerHTML = marca;
            elementoSeletorMarca.appendChild(opcao);
        }
    } catch(e){
        setTimeout(popularSeletorMarca,100);
    }
    
}
popularSeletorMarca();


//Popular o seletor dos modelos com a marca selecionada

function habilitarSeletorModelo(marcaID){
    modelosJSON = null;
    var modeloURLParam = "/"+marcaID+"/modelos";
    xhttpAssincrono(callBackFunctionModelosJSON,modeloURLParam);
    if ($('#seletorModelo option').length!=null) {
        $('#seletorModelo option').remove();
        
    }
    popularSeletorModelo();
}
//Função para preencher o seletor assim que a requisição AJAX retornar
function popularSeletorModelo(){
    
    try{
        var nome;
        var ID;
        for (let index = 0; index < modelosJSON.modelos.length; index++) {
            if(index == 0){
                var seletor = document.createElement("option");
                seletor.innerHTML = "Selecione o modelo";
                elementoSeletorModelo.appendChild(seletor);
            }
            nome = modelosJSON.modelos[index].nome;
            ID = modelosJSON.modelos[index].codigo;
            var opcao = document.createElement("option");
            opcao.setAttribute("value", ID);
            opcao.innerHTML = nome;
            elementoSeletorModelo.appendChild(opcao);
        }
    }
    catch(e){
        setTimeout(popularSeletorModelo,100);
    }
}


//Popular o seletor dos anos com o modelo selecionado

function habilitarSeletorAno(modeloID){
    anosJSON = null;
    var marcaID = elementoSeletorMarca.value;
    var anosURLParam = "/"+marcaID+"/modelos/"+modeloID+"/anos";
    xhttpAssincrono(callBackFunctionAnosJSON,anosURLParam);
    if ($('#seletorAno option').length!=null) {
        $('#seletorAno option').remove();
    }
    popularSeletorAno();
}

function popularSeletorAno(){
    
    try{
        var nome;
        var ID;
        for (let index = 0; index < anosJSON.length; index++) {
            if (index == 0){
                var seletor = document.createElement("option");
                seletor.innerHTML = "Selecione o ano";
                elementoSeletorAno.appendChild(seletor);
            }
            nome = anosJSON[index].nome;
            ID = anosJSON[index].codigo;
            var opcao = document.createElement("option");
            opcao.setAttribute("value", ID);
            opcao.innerHTML = nome;
            elementoSeletorAno.appendChild(opcao);
        }
    }
    catch(e){
        setTimeout(popularSeletorAno,100);
    }
}

//Funcao para mostrar preço do automóvel
function mostrarPreco(anoID){
    precoJSON = null;
    var marcaID = elementoSeletorMarca.value;
    var modeloID = elementoSeletorModelo.value;
    var valorURLParam = "/"+marcaID+"/modelos/"+modeloID+"/anos/"+anoID;
    xhttpAssincrono(callBackFunctionPrecoJSON, valorURLParam);
    popularCampoPreco();
}

function popularCampoPreco(){
    try{
        valorTabela.innerHTML = precoJSON.Valor;
        marcaTabela.innerHTML = precoJSON.Marca;
        modeloTabela.innerHTML = precoJSON.Modelo;
        anoTabela.innerHTML = precoJSON.AnoModelo;
        combustivelTabela.innerHTML = precoJSON.Combustivel;
        codFipeTabela.innerHTML = precoJSON.CodigoFipe;
        mesRefTabela.innerHTML = precoJSON.MesReferencia;
        tabela.hidden = false;
        botaoFavoritos.hidden = false;
        var carro = new carrosLS(precoJSON.Marca, precoJSON.Modelo, precoJSON.CodigoFipe);
        adicionarAListaAcesso(carro);
    }
    catch(e){
        setTimeout(popularCampoPreco,100);
    }
}


//construtor para estruturar o armazenamento de dados no localStorage
function carrosLS(marca, modelo, codFIPE){
    this.marca = marca;
    this.modelo = modelo;
    this.codFipe = codFIPE;
    this.numeroAcessos = 1;
}

var acces_list = JSON.parse(localStorage.getItem('lista_acesso')) || [];
var favoritos_list = JSON.parse(localStorage.getItem('lista_favoritos')) || [];

function adicionarAListaAcesso(carro){
    var achou = 0;
    if (acces_list !== null){
        for (let index = 0; index < acces_list.length; index++) {
            if(carro.codFipe == acces_list[index].codFipe){
                acces_list[index].numeroAcessos++;
                achou = 1;
            }
        }
        if(achou === 0){
            acces_list.push(carro);
        }
        salvarAcesso();
    }
}

function salvarAcesso(){
    localStorage.setItem('lista_acesso', JSON.stringify(acces_list));
}

function favoritarBusca(){
    favoritos_list.push(precoJSON);
    popularListaFavoritos();
    salvarFavoritos();
}

function popularListaFavoritos(){
    listaFavoritos.innerHTML = 'Buscas Favoritas:';
    for (let favorito of favoritos_list){
        var elementoFavorito = document.createElement('li');
        var textoFavorito = document.createTextNode(favorito.Modelo + ' ' + favorito.AnoModelo + ' ');
        
        var elementoLinkb = document.createElement('a');
        var linkTextob = document.createTextNode('  Ver Dados ');
        elementoLinkb.appendChild(linkTextob);
        elementoLinkb.setAttribute('href', '#');
        var pos = favoritos_list.indexOf(favorito);
        elementoLinkb.setAttribute('onclick','mostrarNaTabela('+pos+')');
        console.log(favorito.Valor);
        var elementoLinka = document.createElement('a');
        var linkTextoa = document.createTextNode('  Excluir');
        elementoLinka.appendChild(linkTextoa);
        elementoLinka.setAttribute('href', '#');
        elementoLinka.setAttribute('onclick','deleteFavorito('+ pos +')');

        elementoFavorito.appendChild(textoFavorito);
        elementoFavorito.appendChild(elementoLinkb);
        elementoFavorito.appendChild(elementoLinka);
        listaFavoritos.appendChild(elementoFavorito);
    } 
}

function mostrarNaTabela(pos){
    Carro = favoritos_list[pos];
    valorTabela.innerHTML = Carro.Valor;
    marcaTabela.innerHTML = Carro.Marca;
    modeloTabela.innerHTML = Carro.Modelo;
    anoTabela.innerHTML = Carro.AnoModelo;
    combustivelTabela.innerHTML = Carro.Combustivel;
    codFipeTabela.innerHTML = Carro.CodigoFipe;
    mesRefTabela.innerHTML = Carro.MesReferencia;
    tabela.hidden = false;
}

function deleteFavorito(pos){
    favoritos_list.splice(pos, 1);
    popularListaFavoritos();
    salvarFavoritos();
}

function salvarFavoritos(){
    localStorage.setItem('lista_favoritos', JSON.stringify(favoritos_list));
}

//Gerar gráficos



function mostrarGrafico(){

    var dadosGrafico = [];
    for (let i = 0; i < acces_list.length; i++) {
        dadosGrafico.push([acces_list[i].modelo, acces_list[i].numeroAcessos]);  
    }
    console.log(dadosGrafico);
    //Gerar o grafico usando o Google Charts
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Modelo mais Acessados');
        data.addColumn('number', 'Acessos')
        data.addRows(dadosGrafico);

        var options = {
          title: 'Modelos mais Acessados',
          isStacked: 'relative'
        };

        var chart = new google.visualization.PieChart(document.getElementById('grafico'));

        chart.draw(data, options);
    }

}

popularListaFavoritos();