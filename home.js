var motoristaMarker = null, dados, latitude, longitude, velocidade, altitude, resposta, motoristas, dados_inicio, retorno_categorias, index, resposta_saldo, resultado_retorno, dados_status, menu_aberto, dados_cidade, latitude_usuario, endereco_inicial, endereco_texto, iniciar_listagem, id_categori_escolhida, forma_pagamento, tamanho_msg, largura_menu, largura_da_tela, longitude_usuario, endereco_final, endereco, motorista_id, contador, valor_corrida, tempo_timer, status_minimizado, categorias_minimizado, altura_tela_categorias, latitude_inicial, lat_motorista, latitude_final, url_principal, forma_de_pagamento, minutos, temporizador_busca_motoristas, status_anterior, altura_tela_status, nome_cliente, lonngitude_inicial, senha, lng_motorista, longitude_final, telefone, lista_de_categorias, temporizador_relogio, status_texto, lat_resposta_1, long_resposta_2, dados_viagem, msg, cidade_id, Item, polilinha, km, lat_motorista_selecionado, cliente_id, token, temporizador_busca_status, lng_motorista_selecionado, url_imagem;

// Arrays de marcadores separados
var MakersFixos = [];      // Origem e destino
var MakersMotoristas = []; // Motoristas em atualizaÃ§Ã£o

// Descreva esta funÃ§Ã£o...
function fechar_menu() {
  menu_aberto = false;
  largura_menu = largura_da_tela - largura_da_tela * 2;  // Calcula a largura do menu
  $("#tela_menu").animate({left: largura_menu+"px"}, 300);  // AnimaÃ§Ã£o para fechar (deslocando para a direita)
  $("#tela_menu").css("z-index", "25");  // Define o z-index para evitar sobreposiÃ§Ã£o
  $("#tela_menu").css("position", "fixed");  // Ajusta a posiÃ§Ã£o para fixa quando fechado
  console.log(largura_da_tela);
}

// Descreva esta funÃ§Ã£o...
function gerar_dados_cidade(dados) {
  dados_cidade = JSON.parse(dados);
  if (localStorage.getItem('latitude') || '') {
    latitude_usuario = localStorage.getItem('latitude') || '';
  } else {
    latitude_usuario = dados_cidade['latitude'];
  }
  if (localStorage.getItem('longitude') || '') {
    longitude_usuario = localStorage.getItem('longitude') || '';
  } else {
    longitude_usuario = dados_cidade['longitude'];
  }
  localStorage.setItem('token_mp',dados_cidade['token']);
  $("#txt_contato").html((['Telefone: ',dados_cidade['telefone'],'<br> Email: ',dados_cidade['email']].join('')));
  $("#txt_nome_telefone_dados").html((['Nome: ',localStorage.getItem('nome_cliente') || '','<br> Telefone: ',localStorage.getItem('telefone_cliente') || ''].join('')));
  map.panTo(new google.maps.LatLng((txt_to_number(latitude_usuario)), (txt_to_number(longitude_usuario))));
}

// Descreva esta funÃ§Ã£o...
function abrir_menu() {
  menu_aberto = true;
  $("#"+'tela_menu').show();
  $("#"+'tela_menu').css("position","fixed");
  $("#"+'tela_menu').animate({left:0+"px"},300);
}

// Descreva esta funÃ§Ã£o...
function alterar_senha() {
  if (!$("#dados_senha_1").val().length || !$("#dados_senha_2").val().length) {
    Swal.fire({
    icon: 'error',
    title: 'Campo vazio',
    text: 'Preencha os campos de senha'
    });
  } else {
    if ($("#dados_senha_1").val() == $("#dados_senha_2").val()) {
      if (!localStorage.getItem('senha_cliente') || ''.length) {
        Swal.fire({
        icon: 'error',
        title: 'NÃ£o Logado',
        text: 'FaÃ§a login novamente'
        });
      } else {
        ajax_post_async((String(url_principal) + 'redefinir_senha_logado.php'), {cliente_id:cliente_id, nova_senha:$("#dados_senha_1").val(), senha_atual:senha, token:token}, finaliza_redefinir_senha);
      }
    } else {
      Swal.fire({
      icon: 'error',
      title: 'Senha invÃ¡lida',
      text: 'Senhas nÃ£o conferem'
      });
    }
  }
}

// Descreva esta funÃ§Ã£o...
function verificar_saudacao() {
  // Limpar o localStorage sempre que a tela de boas-vindas for exibida
  /*localStorage.removeItem('savedRoute');
  localStorage.removeItem('destinoMarker');
  console.log('LocalStorage limpo na tela de boas-vindas');*/

  // Atualizar a saudaÃ§Ã£o conforme a hora do dia
  if ((new Date().getHours()) >= 0 && (new Date().getHours()) < 12) {
    $("#lbl_boas_vindas").html('Bom dia, ' + String(nome_cliente) + ' ðŸ˜Ž');
  } else if ((new Date().getHours()) >= 12 && (new Date().getHours()) < 18) {
    $("#lbl_boas_vindas").html('Boa tarde, ' + String(nome_cliente) + ' ðŸ˜Ž');
  } else {
    $("#lbl_boas_vindas").html('Boa noite, ' + String(nome_cliente) + ' ðŸ˜Ž');
  }
}

// Descreva esta funÃ§Ã£o...
function fechar_modal() {
  $("#modal_contato").modal("hide");
}

// Descreva esta funÃ§Ã£o...
function enviar_whats_contato() {
  let msg_uri_encoded = window.encodeURIComponent('OlÃ¡');
  window.open("https://api.whatsapp.com/send?phone=" + ('+55' + String(dados_cidade['telefone'])) + "&text=" + msg_uri_encoded, "_blank");
}

// Descreva esta funÃ§Ã£o...
function fechar_modal_dados() {
  $("#modal_dados").modal("hide");
}

// Descreva esta funÃ§Ã£o...
function finaliza_redefinir_senha(resposta) {
  Swal.fire(JSON.parse(resposta)['mensagem']);
  $("#modal_dados").modal("hide");
  if (JSON.parse(resposta)['status'] == 'sucesso') {
    senha = $("#dados_senha_1").val();
    localStorage.setItem('senha_cliente',senha);
  }
  $("#dados_senha_1").val('');
  $("#dados_senha_2").val('');
}

// Descreva esta funÃ§Ã£o...
function obter_endereco_usuario() {
  if (latitude_usuario && longitude_usuario) {
    function geocodeLatLng() {
    var geocoder = new google.maps.Geocoder();
    var latlng = {lat: (txt_to_number(latitude_usuario)), lng: (txt_to_number(longitude_usuario))};
    geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
    if (results[0]) {
    endereco = results[0].formatted_address;
      latitude_inicial = latitude_usuario;
      lonngitude_inicial = longitude_usuario;
      $("#box_origem").val(endereco);
    } else {
    window.alert('Nenhum Resultado Encontrado');
    }
    } else {
    window.alert('Geocoder falhou: ' + status);
    }
    });
    }
    geocodeLatLng();
  }
}

function mathRandomInt(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    var c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}

// FunÃ§Ã£o para exibir motoristas no mapa
function mostrar_motoristas(motoristas) {
  if (!motoristas) return;

  motoristas = JSON.parse(motoristas);

  // Limpa apenas os marcadores de motoristas
  MakersMotoristas.forEach(marker => marker.setMap(null));
  MakersMotoristas = [];

  for (var Item_index in motoristas) {
    let Item = motoristas[Item_index];
    let lat_motorista = txt_to_number(Item['latitude']);
    let lng_motorista = txt_to_number(Item['longitude']);
    let motorista_id = Item['id'];

    // Escolhe Ã­cone
    const onlineIcons = ["assets/moto_on_a1.png", "assets/moto_on_c1.png", "assets/moto_on_b1.png", "assets/moto_on_f1.png", "assets/moto_on_d1.png", "assets/moto_on_g1.png", "assets/moto_on_e1.png", "assets/moto_on_h1.png"];
    const offlineIcons = ["assets/moto_off_a2.png", "assets/moto_off_c2.png", "assets/moto_off_b2.png", "assets/moto_off_d2.png"];
    let selectedIcon = Item['online'] == 1
      ? onlineIcons[Math.floor(Math.random() * onlineIcons.length)]
      : offlineIcons[Math.floor(Math.random() * offlineIcons.length)];

    // Cria marcador do motorista
    var marker = new google.maps.Marker({
      position: { lat: lat_motorista, lng: lng_motorista },
      map: map,
      icon: selectedIcon,
      title: Item['online'] == 1 ? "Motorista DisponÃ­vel" : "Motorista Ocupado",
      marker_id: motorista_id,
      zIndex: google.maps.Marker.MAX_ZINDEX
    });

    marker.addListener("click", function() {
      let id = this.marker_id;
      // aÃ§Ã£o ao clicar
    });

    MakersMotoristas.push(marker);
  }
}

// Descreva esta funÃ§Ã£o...
function proximo_input() {
    function addAutocomplete() {
        var input = document.getElementById('box_destino');
        let radius = 50000;
        let center = new google.maps.LatLng(latitude_usuario, longitude_usuario);
        let circle = new google.maps.Circle({ center: center, radius: radius });
        let options = { bounds: circle.getBounds() };

        autocomplete_box_destino = new google.maps.places.Autocomplete(input, options);

        autocomplete_box_destino.addListener("place_changed", () => {
            let place = autocomplete_box_destino.getPlace();
            endereco_texto = place.formatted_address;
            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();

            endereco_final = endereco_texto;
            latitude_final = latitude;
            longitude_final = longitude;

            // Remove marcador antigo de destino
            MakersFixos.forEach(marker => { if (marker.marker_id === 2) marker.setMap(null); });
            MakersFixos = MakersFixos.filter(marker => marker.marker_id !== 2);

            // --- MARCADORES ---
            var originMarker = MakersFixos.find(marker => marker.marker_id === 1);
            if (!originMarker) {
                originMarker = new google.maps.Marker({
                    position: { lat: latitude_inicial, lng: lonngitude_inicial },
                    map: map,
                    icon: "assets/origem.png",
                    title: "Origem",
                    marker_id: 1,
                    zIndex: google.maps.Marker.MAX_ZINDEX + 1
                });
                MakersFixos.push(originMarker);
            }

            var destinationMarker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                icon: "assets/destino.png",
                title: "Destino",
                marker_id: 2,
                zIndex: google.maps.Marker.MAX_ZINDEX + 1
            });
            MakersFixos.push(destinationMarker);

            // --- POLYLINE ---
            directionsService = new google.maps.DirectionsService();
            let request = {
                origin: new google.maps.LatLng(latitude_inicial, lonngitude_inicial),
                destination: new google.maps.LatLng(latitude, longitude),
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                durationInTraffic: true,
            };

            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    polilinha = response.routes[0].overview_polyline;
                    var polyline = new google.maps.Polyline({
                        strokeColor: "#ffd200",
                        strokeOpacity: 1,
                        strokeWeight: 5,
                        map: map
                    });
                    polyline.polyline_id = 9;
                    polyline.setPath(google.maps.geometry.encoding.decodePath(polilinha));
                    Polylines.push(polyline);

                    const origem = new google.maps.LatLng(latitude_inicial, lonngitude_inicial);
                    const destino = new google.maps.LatLng(latitude, longitude);
                    const bounds = new google.maps.LatLngBounds();
                    MakersFixos.forEach(marker => bounds.extend(marker.getPosition()));

                    // --- FUNÃ‡ÃƒO PARA OFFSET VERTICAL ---
                    function getOffsetCenter(centerLatLng, offsetYpixels) {
                        const scale = Math.pow(2, map.getZoom());
                        const worldCoordinateCenter = map.getProjection().fromLatLngToPoint(centerLatLng);
                        const pixelOffset = new google.maps.Point(0, -offsetYpixels / scale);
                        return map.getProjection().fromPointToLatLng(
                            new google.maps.Point(
                                worldCoordinateCenter.x + pixelOffset.x,
                                worldCoordinateCenter.y + pixelOffset.y
                            )
                        );
                    }

                    function animatePan(from, to, zoomFrom, zoomTo, duration, callback) {
                        const frames = 60;
                        let step = 0;
                        function panStep() {
                            step++;
                            const lat = from.lat() + (to.lat() - from.lat()) * (step / frames);
                            const lng = from.lng() + (to.lng() - from.lng()) * (step / frames);
                            const zoom = zoomFrom + (zoomTo - zoomFrom) * (step / frames);
                            map.setCenter({ lat: lat, lng: lng });
                            map.setZoom(zoom);
                            if (step < frames) requestAnimationFrame(panStep);
                            else if (callback) callback();
                        }
                        panStep();
                    }

                    // --- SEQUÃŠNCIA COM DELAYS E OFFSET ---
setTimeout(() => { // zoom origem
    animatePan(getOffsetCenter(origem, -100), getOffsetCenter(origem, -100), 16, 16, 2000);
}, 500);

setTimeout(() => { // afastar da origem
    animatePan(getOffsetCenter(origem, -100), getOffsetCenter(origem, -100), 16, 14, 1500);
}, 3000);

setTimeout(() => { // mover atÃ© destino
    animatePan(origem, destino, 14, 16, 2500); // sem deslocamento no destino
}, 5000);


                    setTimeout(() => { // afastar para mostrar toda a rota
    map.fitBounds(bounds);
    
    // ForÃ§a o mapa a redesenhar
    google.maps.event.trigger(map, 'resize');

    // Ajusta o zoom final
    let currentZoom = map.getZoom();
    if (currentZoom > 14) map.setZoom(14);
    if (currentZoom < 10) map.setZoom(10);

    // Espera o mapa terminar de renderizar antes de qualquer aÃ§Ã£o futura
    google.maps.event.addListenerOnce(map, 'idle', () => {
        console.log("Mapa totalmente carregado e pronto!");
        // Aqui vocÃª pode colocar qualquer aÃ§Ã£o que dependa do mapa carregado
    });
}, 8000);

                } else {
                    alert("Erro: " + status);
                }
            });
        });
    }

    addAutocomplete();
}



// Descreva esta funÃ§Ã£o...
function busca_inicio(dados_inicio) {
  if (dados_inicio) {
    ajax_post_async((String(url_principal) + 'get_status_chamado.php'), {telefone:telefone, senha:senha}, verifica_status);
    $("#"+'tela_status').show();
    $("#"+'tela_barra_inicio').hide();
    resultado_chamado([]);
  }
}

// Descreva esta funÃ§Ã£o...
function n_cancelar() {
}

// Descreva esta funÃ§Ã£o...
function cancelar() {
  ajax_post_async((String(url_principal) + 'cancelar.php'), {telefone:telefone, senha:senha}, fim_cancelar);
}

// Descreva esta funÃ§Ã£o...
function fim_cancelar() {
  window.location.href = "home.php";}

// Descreva esta funÃ§Ã£o...
function exibir_categorias(retorno_categorias) {
  iniciar_listagem = true;
  contador = 0;
  id_categori_escolhida = 0;

  lista_de_categorias = JSON.parse(retorno_categorias)['categorias'];
  dados_viagem = JSON.parse(retorno_categorias)['dados'];
  km = dados_viagem['km'];
  minutos = dados_viagem['minutos'];

  document.getElementById("tela_lista_categorias").innerHTML = '';

  for (var Item_index2 in lista_de_categorias) {
    let Item = lista_de_categorias[Item_index2];
    contador++;

    let card = `
      <div onclick="mudar_categoria(${contador})" 
           class="meus_cards" 
           id="${contador}" 
           style="width: calc(100% - 15px); margin: 15px 7.5px; padding: 5px; border-radius: 12px; box-shadow: 7px 7px 13px 0px rgba(50, 50, 50, 0.22);">
        <div class="row">
          <div class="col-4">
            <img class="imagem_meus_cards" src="${url_imagem + Item['img']}" alt="imagem">
          </div>
          <div class="col-8" style="padding-top:15px;">
            <span class="titulo_meus_cards" style="font-weight:bold; font-size:16px;">
              ${Item['nome']}<br>R$ ${Item['taxa']}
            </span><br>
            <span class="subtitulo_meus_cards" style="font-size:14px; color:#000;">
              ${Item['descricao']}
            </span><br>
            <span class="texto_adicional_meus_cards" style="font-size:12px; color:#666;">
              Clique para selecionar
            </span>
          </div>
        </div>
      </div>
    `;

    document.getElementById("tela_lista_categorias").innerHTML += card;

    if (iniciar_listagem) {
      iniciar_listagem = false;
      id_categori_escolhida = Item['id'];
      valor_corrida = Item['taxa'];
      $("#btn_confirmar_corrida").html(`Confirmar ${Item['nome']} R$ ${Item['taxa']}`);
      document.getElementById(contador).style.border = "2px solid #009900";
    } else {
      document.getElementById(contador).style.border = "1px solid #c0c0c0";
    }
  }

  $(".meus_cards").css({
    "margin-left": "7.5px",
    "margin-right": "7.5px",
    "margin-top": "15px",
    "margin-bottom": "15px"
  });

  $(".imagem_meus_cards").css({
    "padding-left": "20px",
    "padding-top": "5px",
    "height": "80px",
    "width": "80px"
  });

  let telaCategorias = document.getElementById('tela_categorias');
  telaCategorias.style.position = "fixed";
  telaCategorias.style.bottom = "20px";
  telaCategorias.style.left = "50%";
  telaCategorias.style.transform = "translateX(-50%)";
  telaCategorias.style.zIndex = "20";
  telaCategorias.style.borderRadius = "20px";
  telaCategorias.style.width = (window.innerWidth * 0.95) + "px";

  $("#tela_destinos, #tela_barra_inicio, #tela_btn_avancar").hide();

  // Inicialmente mantÃ©m a tela de categorias oculta
  $("#tela_categorias").hide();

  // Exibe a tela de categorias somente apÃ³s 8 segundos (ou ajuste conforme a animaÃ§Ã£o do mapa)
  setTimeout(() => {
      $("#tela_categorias").show();
  }, 9000);

  // Mensagem temporÃ¡ria
  let avisoRota = document.createElement('div');
  avisoRota.innerText = "Esta Ã© a rota mais rÃ¡pida de acordo com o trÃ¢nsito.";
  avisoRota.style.position = "fixed";
  avisoRota.style.bottom = "150px";
  avisoRota.style.left = "50%";
  avisoRota.style.transform = "translateX(-50%)";
  avisoRota.style.backgroundColor = "rgba(0,0,0,0.8)";
  avisoRota.style.color = "#ffffff";
  avisoRota.style.padding = "10px 20px";
  avisoRota.style.borderRadius = "10px";
  avisoRota.style.fontSize = "14px";
  avisoRota.style.zIndex = "50";
  avisoRota.style.opacity = "1";
  avisoRota.style.transition = "opacity 3s ease-out";
  avisoRota.style.textAlign = "center";
  avisoRota.style.whiteSpace = "normal";
  avisoRota.style.maxWidth = "250px";
  document.body.appendChild(avisoRota);
  setTimeout(() => {
    avisoRota.style.opacity = "0";
    setTimeout(() => { avisoRota.remove(); }, 3000);
  }, 4000);
}


// =========================
// Muda a categoria selecionada
// =========================
function mudar_categoria(index) {
  id_categori_escolhida = lista_de_categorias[index-1]['id'];
  valor_corrida = lista_de_categorias[index-1]['taxa'];
  $("#btn_confirmar_corrida").html(`Confirmar ${lista_de_categorias[index-1]['nome']} R$ ${lista_de_categorias[index-1]['taxa']}`);
  $(".meus_cards").css("border", "1px solid #cccccc");
  document.getElementById(index).style.border = "2px solid #009900";
}

// =========================
// Salva endereÃ§os no localStorage
// =========================
function salvar_enderecos() {
  localStorage.setItem("endereco_origem", $("#box_origem").val());
  localStorage.setItem("endereco_destino", $("#box_destino").val());
}

// =========================
// BotÃ£o Confirmar Corrida
// =========================
$("#btn_confirmar_corrida").off("click").on("click", confirmar_pagamento);

function confirmar_pagamento() {
  let forma_de_pagamento = $("input[name=forma_pagamento]:checked").val();

  if (!forma_de_pagamento) {
    Swal.fire({
      title: 'Selecione a forma de pagamento!',
      confirmButtonColor: '#000'
    });
    return;
  }

  if (forma_de_pagamento === "Carteira CrÃ©dito") {
    ajax_post_async(
      url_principal + 'verifica_saldo.php',
      { telefone: telefone, senha: senha, valor: valor_corrida },
      verifica_saldo
    );
  } else {
    enviar_solicitacao_chamado(forma_de_pagamento);
  }
}

// =========================
// Envia solicitaÃ§Ã£o de corrida
// =========================
function enviar_solicitacao_chamado(forma_de_pagamento) {
  let endereco_inicial = localStorage.getItem("endereco_origem") || $("#box_origem").val();
  let endereco_final = localStorage.getItem("endereco_destino") || $("#box_destino").val();

  let resumoCorrida = `
    <b>Origem:</b> ${endereco_inicial}<br>
    <b>Destino:</b> ${endereco_final}<br>
    <b>Categoria:</b> ${lista_de_categorias.find(c => c.id == id_categori_escolhida).nome}<br>
    <b>Valor:</b> R$ ${valor_corrida}
  `;

  Swal.fire({
    title: 'Confirmar corrida?',
    html: resumoCorrida,
    showCancelButton: true,
    confirmButtonText: 'Sim, chamar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#000',
    cancelButtonColor: '#dc3545'
  }).then((result) => {
    if (result.isConfirmed) {
      $("#tela_categorias").hide();
      $("#loading").show();

      ajax_post_async(
        url_principal + 'insere_chamado.php',
        {
          senha: senha,
          telefone: telefone,
          valor: valor_corrida,
          forma_pagamento: forma_de_pagamento,
          endereco_ini: endereco_inicial,
          endereco_fim: endereco_final,
          categoria_id: id_categori_escolhida,
          lat_ini: latitude_inicial,
          lng_ini: lonngitude_inicial,
          lat_fim: latitude_final,
          lng_fim: longitude_final,
          km: km,
          tempo: minutos,
          taxa: valor_corrida
        },
        resultado_chamado
      );

      localStorage.removeItem("endereco_origem");
      localStorage.removeItem("endereco_destino");
    }
  });
}

// =========================
// Verifica saldo para Carteira CrÃ©dito
// =========================
function verifica_saldo(resposta_saldo) {
  resposta_saldo = JSON.parse(resposta_saldo);

  if (resposta_saldo['status'] === 'erro') {
    Swal.fire({
      title: 'Saldo insuficiente!',
      text: 'Recarregue sua Autopay ou selecione outra forma de pagamento.',
      confirmButtonColor: '#000'
    });
  } else {
    let forma_de_pagamento = $("input[name=forma_pagamento]:checked").val();
    enviar_solicitacao_chamado(forma_de_pagamento);
  }
}

// Descreva esta funÃ§Ã£o...
function resultado_chamado(resultado_retorno) {
  $("#"+'loading').hide();
  tempo_timer = 0;
  minutos = 0;
  temporizador_relogio = setInterval(function(){
    tempo_timer = tempo_timer + 1;
    if (tempo_timer > 59) {
      tempo_timer = 0;
      minutos = minutos + 1;
    }
    if (tempo_timer < 10) {
      $("#txt_timer").html(([minutos,':','0',tempo_timer].join('')));
    } else {
      $("#txt_timer").html(([minutos,':',tempo_timer].join('')));
    }
  }, 1000);
  $("#"+'tela_status').show();
  let telaStatus = document.getElementById('tela_status');
telaStatus.style.position = "fixed";
telaStatus.style.bottom = "20px";
telaStatus.style.left = "0";
telaStatus.style.right = "0";
telaStatus.style.zIndex = "29";
telaStatus.style.borderRadius = "20px"; // arredonda todos os cantos
  temporizador_busca_status = setInterval(function(){
    ajax_post_async((String(url_principal) + 'get_status_chamado.php'), {telefone:telefone, senha:senha}, verifica_status);
  }, 5000);
  clearInterval(temporizador_busca_motoristas);
  $("#"+'reprodutor_lottie_1').show();
  $("#"+'tela_timer').show();
  deletar_itens_mapa();
}

// Descreva esta funÃ§Ã£o...
function deletar_itens_mapa() {
  // Remove motoristas
  for (var i = 0; i < Makers.length; i++) {
    Makers[i].setMap(null);
  }
  Makers = [];

  // Remove rotas
  for (var i = 0; i < Polylines.length; i++) {
    Polylines[i].setMap(null);
  }
  Polylines = [];

  // Remove origem e destino (fixos)
  for (var i = 0; i < MakersFixos.length; i++) {
    MakersFixos[i].setMap(null);
  }
  MakersFixos = [];
}

// Descreva esta funÃ§Ã£o...
function verifica_status(dados_status) {
  try {
    deletar_itens_mapa();
    clearInterval(temporizador_busca_motoristas);
    dados_status = JSON.parse(dados_status);
    var status_texto = dados_status['status_string'];
    var msg = dados_status['msg'];
    var lat_motorista_selecionado = txt_to_number(dados_status['latitude']);
    var lng_motorista_selecionado = txt_to_number(dados_status['longitude']);
  
    if (msg) {
      if (msg.length > tamanho_msg) {
        tamanho_msg = msg.length;
        $("#icone_chat").html('mark_unread_chat_alt').css({
          "color": "#ff6600",
          "font-size": "28px",
          "font-style": "normal",
          "font-weight": "normal"
        });
        rotateElement('icone_chat', 360);
        document.getElementById('audio_message').play();
      }
    }
  
    if (status_texto != status_anterior) {
      document.getElementById('audio').play();
      status_anterior = status_texto;
    }
  
    if (status_texto === 'PROCURANDO AUTOBOY...') {
      $("#tela_barra_inicio, #tela_img_motorista, #tela_dados_motorista").hide();
      $("#reprodutor_lottie_1, #tela_timer").show();
      ajax_post_async(String(url_principal) + 'get_all_motoristas.php', { senha: senha, telefone: telefone }, mostrar_motoristas);
    }
  
    function criarCardMotorista(dados_status) {
    let avaliacao = dados_status['avaliacao'];
    let estrelas = '';
    for (let i = 0; i < 5; i++) {
        estrelas += i < avaliacao ? 'â­' : 'â˜†';
    }

    return `
        <div style="
    display: flex;
    align-items: flex-start;
    background-color: #fff;
    padding: 20px;
    border-radius: 15px;
    font-family: 'Arial', sans-serif;
    width: 100%; /* deixa o card maior ocupando toda a largura */
    max-width: 400px; /* controla o limite mÃ¡ximo */
    margin: 0 auto; /* centraliza horizontalmente o card */
">
    <img src="${String(url_imagem) + String(dados_status['motorista_img'])}" 
        alt="Motorista" 
        onclick="ampliarImagemMotorista(this)"
        style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; margin-right: 20px; cursor: pointer;">
    
    <div style="display: flex; flex-direction: column; justify-content: center; text-align: left;">
        <div style="font-size: 20px; font-weight: bold; color: #000; margin-bottom: 5px;">
            ${dados_status['motorista_nome']}
        </div>
        <div style="font-size: 16px; color: #FFA500; margin-bottom: 5px;">
            ${estrelas}
        </div>
        <div style="font-size: 18px; font-weight: bold; color: #000; margin-bottom: 3px;">
            ${dados_status['veiculo']}
        </div>
        <div style="font-size: 18px; font-weight: bold; color: #555;">
            ${dados_status['placa']}
        </div>
    </div>
</div>
    `;
}

// =========================
// AUTOBOY A CAMINHO
// =========================
if (status_texto === 'AUTOBOY A CAMINHO') {
    $("#tela_barra_inicio, #reprodutor_lottie_1, #tela_timer").hide();
    //$("#img_motorista").attr("src", String(url_imagem) + String(dados_status['motorista_img']));
    //$("#tela_img_motorista").show();
    $("#dados_motorista").html(criarCardMotorista(dados_status));

    // Remove motoristas antigos do mapa
    MakersMotoristas.forEach(marker => marker.setMap(null));
    MakersMotoristas = [];
      
      var marker = new google.maps.Marker({
        position: { lat: lat_motorista_selecionado, lng: lng_motorista_selecionado },
        map: map,
        icon: "assets/autoload.png",
        title: "Motorista",
        marker_id: 3
      });
      marker.addListener("click", function () {
        let id = this.marker_id;
      });
      Makers.push(marker);
      $("#dados_motorista").css("text-align", "center");
      $("#tela_dados_motorista").show();
    }
  
    if (status_texto === 'AUTOBOY CHEGOU!') {
      $("#tela_barra_inicio, #reprodutor_lottie_1, #tela_timer").hide();
      //$("#img_motorista").attr("src", String(url_imagem) + String(dados_status['motorista_img']));
      //$("#tela_img_motorista").show();
      $("#dados_motorista").html(criarCardMotorista(dados_status));
      $("#dados_motorista").css("text-align", "center");
      $("#tela_dados_motorista").show();
      
      // ========================
    // APAGA TODOS OS MOTORISTAS DO MAPA
    // ========================
    MakersMotoristas.forEach(marker => marker.setMap(null));
    MakersMotoristas = [];
      
      var marker = new google.maps.Marker({
        position: { lat: lat_motorista_selecionado, lng: lng_motorista_selecionado },
        map: map,
        icon: "assets/autoload.png",
        title: "Motorista",
        marker_id: 3
      });
      marker.addListener("click", function () {
        let id = this.marker_id;
      });
      Makers.push(marker);
    }
  
   // CÃ³digo para gerenciar a exibiÃ§Ã£o da rota e dos marcadores
if (status_texto === 'EM TRÃ‚NSITO') {
    $("#"+'reprodutor_lottie_1').hide();
    $("#"+'tela_barra_inicio').hide();
    //$("#img_motorista").attr("src", String(url_imagem) + String(dados_status['motorista_img']));
    //$("#tela_img_motorista").show();
    $("#dados_motorista").html(criarCardMotorista(dados_status));
    $("#dados_motorista").css("text-align", "center");
    $("#tela_dados_motorista").show();
    $("#"+'reprodutor_lottie_2').hide();
    $("#"+'tela_timer').hide();
    $("#"+'card_cancelar').hide();
    
    // Use as coordenadas do destino definidas anteriormente
    var lat_destino = latitude_final;
    var lng_destino = longitude_final;

    // Verifica se o marcador do motorista jÃ¡ existe
    if (motoristaMarker) {
        motoristaMarker.setPosition({ lat: lat_motorista_selecionado, lng: lng_motorista_selecionado });
    } else {
        motoristaMarker = new google.maps.Marker({
            position: { lat: lat_motorista_selecionado, lng: lng_motorista_selecionado },
            map: map,
            icon: "assets/autoload.png",
            title: "Motorista",
            marker_id: 3
        });
    }

    // Verifica se a rota jÃ¡ foi calculada e salva
    var savedRoute = localStorage.getItem('savedRoute');
    if (!savedRoute) {
        // Adiciona o marcador do destino
        var destinoMarker = new google.maps.Marker({
            position: { lat: lat_destino, lng: lng_destino },
            map: map,
            icon: "assets/destino.png",
            title: "Destino",
            marker_id: 4
        });

        // Calcula a rota apenas uma vez
        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        directionsRenderer.setMap(map);

        var request = {
            origin: { lat: lat_motorista_selecionado, lng: lng_motorista_selecionado },
            destination: { lat: lat_destino, lng: lng_destino },
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                localStorage.setItem('savedRoute', JSON.stringify(result));
                localStorage.setItem('destinoMarker', JSON.stringify({ lat: lat_destino, lng: lng_destino }));
            } else {
                console.error("Erro ao buscar a rota: " + status);
            }
        });
    } else {
        // Se a rota jÃ¡ estiver salva, apenas carrega ela
        var directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        directionsRenderer.setMap(map);
        var route = JSON.parse(savedRoute);
        directionsRenderer.setDirections(route);
    }
}

    if (status_texto === 'FINALIZADA') {
      $("#tela_barra_inicio, #tela_img_motorista, #tela_dados_motorista, #reprodutor_lottie_1, #reprodutor_lottie_2, #card_cancelar").hide();
      $("#reprodutor_lottie_3, #tela_txt_finalizar, #card_finalizar").show();
      $("#txt_total_fim").html([
        '<span style="font-size:16px; color:#333333; font-weight:bold;">Total R$ </span>',
        '<span style="font-size:16px; color:#000000; font-weight:bold;">' + dados_status['taxa'] + ' </span>'
      ].join(''));

      // Remove a rota salva do localStorage
      localStorage.removeItem('savedRoute');
      localStorage.removeItem('destinoMarker');

      clearInterval(temporizador_busca_status);
    }
    
    if (status_texto === 'CANCELADA') {
      $("#tela_barra_inicio, #tela_img_motorista, #tela_dados_motorista, #reprodutor_lottie_1, #reprodutor_lottie_2, #reprodutor_lottie_3").hide();
      $("#reprodutor_lottie_4, #card_finalizar").show();
      clearInterval(temporizador_busca_status);
    }
  
    $("#txt_status").html(status_texto);
  } catch (error) {
    console.error("Erro ao processar os dados do status: ", error);
  }
}

function rotateElement(element, angle) {
  let el = document.getElementById(element);
  el.style.transition = "transform 1000ms";
  el.style.transform = "rotate(" + angle + "deg)";
}

$("body").css("height", "100%");
$("html").css("height", "100%");

var map;
var Circles = [];
var Polylines = [];
var Polygons = [];
var Makers = [];

$(document).ready(function() {
    loadGoogleMaps(); // Chama a funÃ§Ã£o para carregar o mapa
});

function initMap() {
  map = new google.maps.Map(document.getElementById('tela_mapa'), {
    center: { lat: txt_to_number(latitude_usuario), lng: txt_to_number(longitude_usuario) },
    zoom: 15,
    gestureHandling: "greedy",
    disableDefaultUI: true, // Remove a maioria dos controles do mapa
    keyboardShortcuts: false,
    styles: dayStyle, // Tema inicial Ã© o padrÃ£o do Google Maps
    clickableIcons: false // Desativa cliques nos pontos de interesse (POIs)
      });

  if (typeof onMapInitilize === "function") {
    onMapInitilize();
  }

  google.maps.event.addListener(map, 'click', function (event) {
    if (typeof onMapClick === "function") {
      onMapClick(event);
    }
  });
  
// Restaurar a rota salva
    var savedRoute = localStorage.getItem('savedRoute');
    if (savedRoute) {
        var directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        directionsRenderer.setMap(map);
        var route = JSON.parse(savedRoute);
        directionsRenderer.setDirections(route);
    }

    // Restaurar o marcador do destino
    var savedDestinoMarker = localStorage.getItem('destinoMarker');
    if (savedDestinoMarker) {
        var destino = JSON.parse(savedDestinoMarker);
        new google.maps.Marker({
            position: { lat: destino.lat, lng: destino.lng },
            map: map,
            icon: "assets/destino.png",
            title: "Destino"
        });
    }
}

// Objeto com os tokens e seus respectivos intervalos
const tokenIntervals = [
    { token: 'AIzaSyCYJYGr27x_A1vS2PgQtu4COShKcDAOs6U', start: 1, end: 10 }, 
    { token: 'AIzaSyCYJYGr27x_A1vS2PgQtu4COShKcDAOs6U', start: 11, end: 20 },
    { token: 'AIzaSyCYJYGr27x_A1vS2PgQtu4COShKcDAOs6U', start: 21, end: 31 }  
];

function getCurrentToken() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    for (const interval of tokenIntervals) {
        if (currentDay >= interval.start && currentDay <= interval.end) {
            return interval.token;
        }
    }
    return null;
}

function loadGoogleMaps() {
    const apiToken = getCurrentToken();
    if (!apiToken) {
        console.error("Nenhum token disponÃ­vel para o dia atual.");
        return;
    }
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiToken + "&libraries=places&callback=initMap";
    script.async = true;
    document.head.appendChild(script);
}

/*var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=" + 'AIzaSyCYJYGr27x_A1vS2PgQtu4COShKcDAOs6U' + "&libraries=places&callback=initMap";
script.async = true;
document.head.appendChild(script);*/

$(document).on("click", "#icone_menu", function(){
  if (menu_aberto) {
    menu_aberto = false;
    largura_menu = largura_da_tela - largura_da_tela * 2;
    $("#"+'tela_menu').css("position","relative");
    $("#"+'tela_menu').animate({left:largura_menu+"px"},300);
    $("#icone_menu").html('menu');
    fechar_menu();
  } else {
    $("#icone_menu").html('menu_open');
    abrir_menu();
  }
});

$(document).on("click", "#tela_carteira_credito", function(){
  window.location.href = "carteira.php";});

$(document).on("click", "#tela_fale_conosco", function(){
  $("#modal_contato").modal("show");
});

//feito com bootblocks.com.br
  document.getElementById('cabecalho').style.position = "fixed";
  document.getElementById('cabecalho').style.top = "0px";
  document.getElementById('cabecalho').style.left = "0";
  document.getElementById('cabecalho').style.right = "0";
  document.getElementById('cabecalho').style.zIndex = "26";
  largura_da_tela = (window.innerWidth * (100 / 100));
  fechar_menu();
  nome_cliente = localStorage.getItem('nome_cliente') || '';
  nome_cliente = nome_cliente.split(' ')[0];
  latitude_usuario = localStorage.getItem('latitude') || '';
  longitude_usuario = localStorage.getItem('longitude') || '';
  token = localStorage.getItem('token') || '';
  url_principal = localStorage.getItem('url_principal') || '';
  url_imagem = localStorage.getItem('url_imagem') || '';
  cidade_id = localStorage.getItem('cidade_id') || '';
  cliente_id = localStorage.getItem('cliente_id') || '';
  senha = localStorage.getItem('senha_cliente') || '';
  telefone = localStorage.getItem('telefone_cliente') || '';
  ajax_post_async((String(url_principal) + 'get_dados_cidade.php'), {token:token, cidade_id:cidade_id}, gerar_dados_cidade);
  ajax_post_async((String(url_principal) + 'busca_inicio.php'), {senha:senha, telefone:telefone}, busca_inicio);
  $("#lbl_nome_cliente_menu").html(
  'OlÃ¡, ' + (localStorage.getItem('nome_cliente') || '').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
);

$(document).on("click", "#tela_meus_dados", function(){
  $("#modal_dados").modal("show");
});

//feito com bootblocks.com.br
  $("#tela_label_cabecalho").css("background", "linear-gradient(180deg, #ffd200 70%, #ffd200 85%, #ffc533 90%, #e6b800 100%)");
  $("#tela_icone_menu").css("background", "linear-gradient(180deg, #ffd200 70%, #ffd200 85%, #ffc533 90%, #e6b800 100%)");
  $("#tela_icone_chat").css("background", "linear-gradient(180deg, #ffd200 70%, #ffd200 85%, #ffc533 90%, #e6b800 100%)");
  $("#card_iniciar").css("background-color", "#ffd200");
  $("#cabecalho").css("display", "flex");
  $("#cabecalho").css("justify-content", "center");
  $("#tela_label_cabecalho").css("display", "flex");
  $("#tela_label_cabecalho").css("justify-content", "center");
  $("#tela_label_cabecalho").css("display", "flex");
  $("#tela_label_cabecalho").css("align-items", "center");
  $("#tela_icone_menu").css("display", "flex");
  $("#tela_icone_menu").css("justify-content", "center");
  $("#tela_icone_menu").css("display", "flex");
  $("#tela_icone_menu").css("align-items", "center");
  $("#tela_icone_chat").css("display", "flex");
  $("#tela_icone_chat").css("justify-content", "center");
  $("#tela_icone_chat").css("display", "flex");
  $("#tela_icone_chat").css("align-items", "center");
  $("#"+'icone_menu').css("padding-left", 5+ "px");
  $("#"+'icone_menu').css("padding-right", 0+ "px");
  $("#"+'icone_menu').css("padding-top", 5+ "px");
  $("#"+'icone_menu').css("padding-bottom", 0+ "px");
  $("#"+'icone_chat').css("padding-left", 0+ "px");
  $("#"+'icone_chat').css("padding-right", 5+ "px");
  $("#"+'icone_chat').css("padding-top", 5+ "px");
  $("#"+'icone_chat').css("padding-bottom", 0+ "px");
  document.getElementById('cabecalho').style['border-bottom-right-radius'] = '15px';
  document.getElementById('cabecalho').style['border-bottom-left-radius'] = '15px';
  document.getElementById('tela_icone_menu').style['border-bottom-left-radius'] = '15px';
  document.getElementById('tela_icone_chat').style['border-bottom-right-radius'] = '15px';

//feito com bootblocks.com.br
  $("#"+'container_menu').css("padding-left", 30+ "px");
  $("#"+'container_menu').css("padding-right", 0+ "px");
  $("#"+'container_menu').css("padding-top", 0+ "px");
  $("#"+'container_menu').css("padding-bottom", 0+ "px");
  $("#tela_carteira_credito").css("display", "flex");
  $("#tela_carteira_credito").css("align-items", "center");
  $("#tela_meus_dados").css("display", "flex");
  $("#tela_meus_dados").css("align-items", "center");
  $("#tela_historico_corridas").css("display", "flex");
  $("#tela_historico_corridas").css("align-items", "center");
  $("#tela_fale_conosco").css("display", "flex");
  $("#tela_fale_conosco").css("align-items", "center");
  $("#tela_sair").css("display", "flex");
  $("#tela_sair").css("align-items", "center");
  document.getElementById('tela_menu').style.border = 1 + "px solid " + "#fff";
  $("#tela_menu").css("border-radius", "15px");

if (navigator.geolocation) {
navigator.geolocation.watchPosition(function(position) {
latitude = position.coords.latitude;
longitude = position.coords.longitude;
velocidade = position.coords.speed;
altitude = position.coords.altitude;
  latitude_usuario = latitude;
  longitude_usuario = longitude;
  localStorage.setItem('latitude',latitude);
  localStorage.setItem('longitude',longitude);
}, function() {
handleLocationError(true, infoWindow, map.getCenter());
});
} else {
// Browser doesn't support Geolocation
handleLocationError(false, infoWindow, map.getCenter());
}

//feito com bootblocks.com.br
  $("#loading").css("background-color", "rgba(0, 0, 0, 0)");
  $("#loading").css("display", "flex");
  $("#loading").css("justify-content", "center");
  $("#"+'loading').hide();

function onMapInitilize(){
  map.setOptions({zoomControl: false});
  map.setOptions({mapTypeControl: false});
  map.setOptions({scaleControl: false});
  map.setOptions({streetViewControl: false});
  function addAutocomplete() {
  var input = document.getElementById('box_origem');
  let radius = 10000;
  let center = new google.maps.LatLng(latitude_usuario, longitude_usuario);
  let circle = new google.maps.Circle({
  center: center,
  radius: radius
  });
  let options = {
  bounds: circle.getBounds()
  };
  autocomplete_box_origem = new google.maps.places.Autocomplete(input, options);
  autocomplete_box_origem.addListener("place_changed", () => {
  let place = autocomplete_box_origem.getPlace();
  endereco_texto = place.formatted_address;
  lat_resposta_1 = place.geometry.location.lat();
  long_resposta_2 = place.geometry.location.lng();
    endereco_inicial = endereco_texto;
    latitude_inicial = lat_resposta_1;
    lonngitude_inicial = long_resposta_2;
    var marker = new google.maps.Marker({
    position: {lat: lat_resposta_1, lng: long_resposta_2},
    map: map,
    icon: "assets/marcador.png",
    title: "Origem",
    marker_id: 1
    });
    marker.addListener("click", function () {
    let id = this.marker_id;
    });
    Makers.push(marker);
  });
  }
  addAutocomplete();
  proximo_input();
  ajax_post_async((String(url_principal) + 'get_all_motoristas.php'), {senha:senha, telefone:telefone}, mostrar_motoristas);
  temporizador_busca_motoristas = setInterval(function(){
    ajax_post_async((String(url_principal) + 'get_all_motoristas.php'), {senha:senha, telefone:telefone}, mostrar_motoristas);
  }, 10000);
};

//feito com bootblocks.com.br
  $("#"+'reprodutor_lottie_1').hide();
  $("#"+'reprodutor_lottie_2').hide();
  $("#"+'reprodutor_lottie_3').hide();
  $("#"+'tela_status').hide();
  $("#"+'tela_categorias').hide();

//feito com bootblocks.com.br
  endereco_inicial = '';
  endereco_final = '';
  latitude_inicial = '';
  lonngitude_inicial = '';
  latitude_final = '';
  longitude_final = '';

$(document).on("click", "#tela_sair", function(){
  localStorage.clear();
  window.location.href = "index.php";});

$(document).on("click", "#btn_avancar", function(){
  if ($("#box_origem").val() && $("#box_destino").val()) {
    $("#"+'loading').show();
    ajax_post_async(
      String(url_principal) + 'calcular_custos.php', 
      {
        cidade_id: cidade_id, 
        lat_ini: latitude_inicial, 
        lng_ini: lonngitude_inicial, 
        lat_fim: latitude_final, 
        lng_fim: longitude_final
      }, 
      exibir_categorias
    );
  } else {
    Swal.fire({
      text: 'Preencha origem e destino!',
      confirmButtonColor: '#000000' // botÃ£o preto
    });
  }
});


//feito com bootblocks.com.br
  $("#box_origem").css("border-radius", "15px");
  $("#box_destino").css("border-radius", "15px");

$(document).on("click", "#card_cancelar", function(){
  Swal.fire({
    title: 'Deseja realmente cancelar a corrida?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'NÃ£o',
    confirmButtonColor: '#000000', // botÃ£o preto
    cancelButtonColor: '#6c757d'   // botÃ£o cinza (cor padrÃ£o do bootstrap cinza)
  }).then((result) => {
    if (result.isConfirmed) {  // use isConfirmed no lugar de result.value
      cancelar();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      n_cancelar();
    }
  });
});

//feito com bootblocks.com.br
  // Estilos aplicados ao botÃ£o AvanÃ§ar e ao card
$("#card_iniciar_chamado").css({
  "background": "#ffd200",
  "display": "flex",
  "justify-content": "center",
  "align-items": "center",
  "width": "90%",
  "height": "auto",
  "border-radius": "30px",
  "margin": "0 auto 10px auto"
});

$("#btn_avancar").css({
  "padding": "10px 20px",
  "font-size": "16px",
  "font-weight": "bold",
  "background": "#ffd200",
  "height": "40px",
  "color": "#000",
  "border": "none",
  "border-radius": "30px",
  "cursor": "pointer",
  "width": "89%",
  "max-width": "400px",
  "display": "flex",
  "justify-content": "center",
  "align-items": "center",
  "margin": "0 0 10px 0"
});

$("#destinos_cabecalho").css({
  "display": "flex",
  "justify-content": "center",
  "align-items": "center"
});

$("#tela_lbl_destino").css({
  "display": "flex",
  "justify-content": "center"
});

$("#tela_btn_avancar").css({
  "display": "flex",
  "justify-content": "center"
});

$("#tela_card_iniciar_chamado").css({
  "display": "flex",
  "justify-content": "center"
});

$("#lbl_avancar").css({
  "margin": "2px 0"
});

// Esconde telas inicialmente
$("#tela_destinos").hide();
$("#tela_btn_avancar").hide();
$("#tela_categorias").hide();


$(document).on("click", "#card_iniciar", function(){
  $("#"+'tela_barra_inicio').hide();
  document.getElementById('tela_destinos').style.position = "fixed";
  document.getElementById('tela_destinos').style.top = "0px";
  document.getElementById('tela_destinos').style.left = "0";
  document.getElementById('tela_destinos').style.right = "0";
  document.getElementById('tela_destinos').style.zIndex = "27";
  $("#"+'tela_destinos').show();
  document.getElementById('tela_btn_avancar').style.position = "fixed";
  document.getElementById('tela_btn_avancar').style.bottom = "20px";
  document.getElementById('tela_btn_avancar').style.left = "0";
  document.getElementById('tela_btn_avancar').style.right = "0";
  document.getElementById('tela_btn_avancar').style.zIndex = "28";
  $("#"+'tela_btn_avancar').show();
  obter_endereco_usuario();
});

// Animando a altura e largura
$("#" + 'tela_barra_inicio').animate({
    height: (window.innerHeight * (15 / 100)) + "px",
    width: (window.innerWidth * (70 / 100)) + "px"
}, 800);

// Definindo a posiÃ§Ã£o fixa, z-index e outras propriedades de estilo
document.getElementById('tela_barra_inicio').style.position = "fixed";
document.getElementById('tela_barra_inicio').style.bottom = "20px";   // MantÃ©m o bloco na parte inferior
document.getElementById('tela_barra_inicio').style.left = "50%";    // Centraliza horizontalmente a partir do meio da tela
document.getElementById('tela_barra_inicio').style.transform = "translateX(-50%)";  // Ajusta a div para centralizar corretamente
document.getElementById('tela_barra_inicio').style.zIndex = "21";   // Garante que a div fique acima de outros elementos

// Adicionando borda arredondada em todos os cantos
document.getElementById('tela_barra_inicio').style.borderRadius = "15px";  // Aplica bordas arredondadas em todos os cantos

// Criando o efeito de flutuaÃ§Ã£o com sombra
document.getElementById('tela_barra_inicio').style.boxShadow = "0px 0px 15px 6px rgba(0, 0, 0, 0.2)";
document.getElementById('tela_barra_inicio').style.transform = "translateX(-50%) translateY(-40px)";  // Desloca um pouco para cima, criando o efeito de flutuaÃ§Ã£o

// Modificando a borda superior de tela_boas_vindas para que fique arredondada
document.getElementById('tela_boas_vindas').style.borderRadius = "15px";  // Aplica bordas arredondadas em todos os cantos
document.getElementById('tela_onde_vamos').style.borderRadius = "15px";  // Aplica bordas arredondadas em todos os cantos
document.getElementById('tela_card_iniciar').style.borderRadius = "15px";  // Aplica bordas arredondadas em todos os cantos


// Mostrando os outros elementos
$("#tela_boas_vindas").css("display", "flex");
$("#tela_boas_vindas").css("justify-content", "center");

$("#tela_onde_vamos").css("display", "flex");
$("#tela_onde_vamos").css("justify-content", "center");

$("#tela_card_iniciar").css("display", "flex");
$("#tela_card_iniciar").css("justify-content", "center");

  verificar_saudacao();
  $("#"+'lbl_boas_vindas').css("margin-left", 0+ "px");
  $("#"+'lbl_boas_vindas').css("margin-right", 0+ "px");
  $("#"+'lbl_boas_vindas').css("margin-top", 10+ "px");
  $("#"+'lbl_boas_vindas').css("margin-bottom", 0+ "px");
  $("#card_iniciar").css("display", "flex");
  $("#card_iniciar").css("justify-content", "center");
  document.getElementById('card_iniciar').style.height = '80' + "px";
  document.getElementById('card_iniciar').style.width = '80' + "%";
  document.getElementById('card_iniciar').style.height = "auto";
  $("#card_iniciar").css("border-radius", "30px");
  $("#card_iniciar").css("display", "flex");
  $("#card_iniciar").css("align-items", "center");
  $("#"+'lbl_onde_card_iniciar').css("margin-left", 0+ "px");
  $("#"+'lbl_onde_card_iniciar').css("margin-right", 0+ "px");
  $("#"+'lbl_onde_card_iniciar').css("margin-top", 2+ "px");
  $("#"+'lbl_onde_card_iniciar').css("margin-bottom", 2+ "px");

$(document).on("click", "#icone_chat", function(){
  window.location.href = "mensagens.php";});

$(document).on("click", "#card_iniciar_chamado", function(){
  forma_pagamento = $("input[name=forma_pagamento]:checked").val();
  if (forma_pagamento) {
    if (forma_pagamento == 'Carteira CrÃ©dito') {
      ajax_post_async(
        String(url_principal) + 'verifica_saldo.php',
        { senha: senha, telefone: telefone, valor: valor_corrida },
        verifica_saldo
      );
    } else {
      enviar_solicitacao_chamado();
    }
  } else {
    Swal.fire({
      text: 'Selecione a forma de Pagamento!',
      confirmButtonColor: '#000'  // botÃ£o preto
    });
  }
});


//feito com bootblocks.com.br
  $("#tela_timer").css("display", "flex");
  $("#tela_timer").css("justify-content", "center");
  $("#card_cancelar").css("background", "#ffd200");
  $("#tela_status_txt").css("display", "flex");
  $("#tela_status_txt").css("justify-content", "center");
  $("#tela_botoes_status").css("display", "flex");
  $("#tela_botoes_status").css("justify-content", "center");
  $("#tela_categorias, #tela_status, #tela_botoes_status, #tela_card_iniciar_chamado, #tela_barra_inicio").css({
    "border-radius": "20px",
    "overflow": "hidden" // garante que os filhos fiquem dentro do arredondamento
});
  $("#card_cancelar").css("display", "flex");
  $("#card_cancelar").css("justify-content", "center");
  document.getElementById('tela_status').style.position = "fixed";
  document.getElementById('tela_status').style.bottom = "20px";
  document.getElementById('tela_status').style.left = "0";
  document.getElementById('tela_status').style.right = "0";
  document.getElementById('tela_status').style.zIndex = "28";
  document.getElementById('tela_status').style.borderRadius = "20px";
  document.getElementById('card_cancelar').style.height = '80' + "px";
  document.getElementById('card_cancelar').style.width = '80' + "%";
  document.getElementById('card_cancelar').style.height = "auto";
  $("#card_cancelar").css("border-radius", "30px");
  $("#card_cancelar").css("display", "flex");
  $("#card_cancelar").css("align-items", "center");
  $("#"+'txt_cancelar').css("margin-left", 0+ "px");
  $("#"+'txt_cancelar').css("margin-right", 0+ "px");
  $("#"+'txt_cancelar').css("margin-top", 2+ "px");
  $("#"+'txt_cancelar').css("margin-bottom", 2+ "px");
  $("#"+'tela_status').hide();
  $("#tela_lottie").css("display", "flex");
  $("#tela_lottie").css("justify-content", "center");
  $("#"+'tela_lottie').css("margin-left", 0+ "px");
  $("#"+'tela_lottie').css("margin-right", 0+ "px");
  $("#"+'tela_lottie').css("margin-top", 10+ "px");
  $("#"+'tela_lottie').css("margin-bottom", 5+ "px");
  $("#"+'reprodutor_lottie_2').hide();
  $("#"+'reprodutor_lottie_3').hide();
  $("#"+'reprodutor_lottie_4').hide();
  $("#tela_img_motorista").css("display", "flex");
  $("#tela_img_motorista").css("justify-content", "center");
  $("#tela_dados_motorista").css("display", "flex");
  $("#tela_dados_motorista").css("justify-content", "center");
  $("#"+'tela_img_motorista').hide();
  $("#"+'tela_dados_motorista').hide();
  $("#"+'audio').hide();
  $("#tela_txt_finalizar").css("display", "flex");
  $("#tela_txt_finalizar").css("justify-content", "center");
  $("#"+'tela_txt_finalizar').hide();

//feito com bootblocks.com.br
  $("#card_finalizar").css("background", "#ffd200");
  $("#card_finalizar").css("display", "flex");
  $("#card_finalizar").css("justify-content", "center");
  document.getElementById('card_finalizar').style.height = '80' + "px";
  document.getElementById('card_finalizar').style.width = '80' + "%";
  document.getElementById('card_finalizar').style.height = "auto";
  $("#card_finalizar").css("border-radius", "30px");
  $("#card_finalizar").css("display", "flex");
  $("#card_finalizar").css("align-items", "center");
  $("#"+'card_finalizar').css("margin-left", 0+ "px");
  $("#"+'card_finalizar').css("margin-right", 0+ "px");
  $("#"+'card_finalizar').css("margin-top", 2+ "px");
  $("#"+'card_finalizar').css("margin-bottom", 2+ "px");
  $("#"+'card_finalizar').hide();

$(document).on("click", "#icone_voltar_destinos", function(){
  $("#"+'tela_destinos').hide();
  $("#"+'tela_btn_avancar').hide();
  $("#"+'tela_barra_inicio').show();
});

$(document).on("click", "#tela_historico_corridas", function(){
  window.location.href = "historico.php";});

//feito com bootblocks.com.br
  $("#tela_cabecalho_status").css("display", "flex");
  $("#tela_cabecalho_status").css("justify-content", "center");
  $("#"+'icone_minimizar').css("margin-left", 0+ "px");
  $("#"+'icone_minimizar').css("margin-right", 10+ "px");
  $("#"+'icone_minimizar').css("margin-top", 10+ "px");
  $("#"+'icone_minimizar').css("margin-bottom", 0+ "px");
  status_minimizado = false;


//feito com bootblocks.com.br
  tamanho_msg = 0;
  $("#"+'audio_message').hide();
  status_anterior = '';

$(document).on("click", "#icone_minimizar", function(){
  if (status_minimizado) {
    status_minimizado = false;
    $("#"+'tela_status').animate({height:altura_tela_status+"px",width:(window.innerWidth * (100 / 100))+"px"},800);
    $("#icone_minimizar").html('close_fullscreen');
  } else {
    status_minimizado = true;
    altura_tela_status = document.getElementById('tela_status').offsetHeight;
    $("#"+'tela_status').animate({height:50+"px",width:(window.innerWidth * (100 / 100))+"px"},800);
    $("#icone_minimizar").html('open_in_full');
  }
});


$(document).on("click", "#card_finalizar", function(){
  window.location.href = "home.php";});
function ajax_post(url, dados){
                let retorno;
                $.ajax({
                    url: url,
                    type: "POST",
                    data: dados,
                    async: false,
                    success: function(data){
                        retorno = data;
                    },
                    error: function(data){
                        retorno = data;
                    }
                });
                return retorno;
            }function ajax_post_async(url, dados, funcao_chamar){
                $.ajax({
                    url: url,
                    type: "POST",
                    data: dados,
                    async: true,
                    success: function(data){
                        funcao_chamar(data);
                    },
                    error: function(data){
                        funcao_chamar(data);
                    }
                });
            }
            function txt_to_number(txt){
            txt = txt+"";
            if(txt.includes(",")){
                txt = txt.replace(",", ".");
            }
            if(txt.includes(".")){
                txt = parseFloat(txt);
            }else{
                txt = parseInt(txt);
            }
            return txt;
        }
        $(document).ready(function(){
            $("#loading-page-bb").css("opacity", "1");
        });