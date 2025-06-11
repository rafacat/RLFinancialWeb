document.addEventListener('DOMContentLoaded', () => {
   // Seleciona todos os elementos "Leia mais..." nos cards de dicas
   const readMoreSpans = document.querySelectorAll('.tip-card .read-more');

   readMoreSpans.forEach(span => {
       span.addEventListener('click', (event) => {
           // Previne o comportamento padrão (se fosse um link)
           event.preventDefault();

           // Encontra o artigo pai (o card da dica)
           const parentArticle = event.target.closest('.tip-card');
           if (!parentArticle) return; // Garante que encontrou o pai

           // Encontra o player de podcast dentro deste artigo
           const podcastPlayer = parentArticle.querySelector('.podcast-player');
           const audioPlayer = parentArticle.querySelector('.podcast-player audio');

           if (podcastPlayer) {
               // Alterna a visibilidade do player
               if (podcastPlayer.style.display === 'none' || podcastPlayer.style.display === '') {
                   // Oculta todos os outros players antes de mostrar este
                   document.querySelectorAll('.podcast-player').forEach(player => {
                       if (player !== podcastPlayer) {
                           player.style.display = 'none';
                           player.querySelector('audio').pause(); // Pausa outros áudios
                           player.querySelector('audio').currentTime = 0; // Volta para o início
                       }
                   });
                   podcastPlayer.style.display = 'block'; // Mostra o player
                   audioPlayer.load(); // Carrega o áudio
                   audioPlayer.play(); // Tenta reproduzir o áudio automaticamente
                   span.textContent = 'Ocultar áudio'; // Muda o texto
               } else {
                   podcastPlayer.style.display = 'none'; // Oculta o player
                   audioPlayer.pause(); // Pausa o áudio
                   audioPlayer.currentTime = 0; // Volta para o início do áudio
                   span.textContent = 'Leia mais...'; // Volta o texto original
               }
           }
       });
   });

   // Opcional: Pausar outros áudios quando um novo começar a tocar
   const allAudioPlayers = document.querySelectorAll('audio');
   allAudioPlayers.forEach(audio => {
       audio.addEventListener('play', (event) => {
           allAudioPlayers.forEach(otherAudio => {
               if (otherAudio !== event.target) {
                   otherAudio.pause();
                   otherAudio.currentTime = 0; // Volta para o início
               }
           });
       });
   });
});

  // Referências aos elementos HTML
    const areaDeslogada = document.getElementById('area-deslogada');
    const btnAbrirPopup = document.getElementById('btn-abrir-popup'); // ID do novo botão
    const popupOverlay = document.getElementById('popup-overlay');
    const btnFecharPopup = document.getElementById('btn-fechar-popup');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('login-message');
    const ferramentaGastos = document.getElementById('ferramenta-gastos');
    const btnLogout = document.getElementById('btn-logout');

    // --- Funções de Controle ---

    // Função para abrir o pop-up
    btnAbrirPopup.addEventListener('click', () => {
        popupOverlay.style.display = 'flex'; // Mostra o overlay do pop-up (usando flex para centralizar)
        loginMessage.textContent = ''; // Limpa qualquer mensagem de erro anterior
        usernameInput.value = ''; // Limpa os campos ao abrir
        passwordInput.value = '';
    });

    // Função para fechar o pop-up
    btnFecharPopup.addEventListener('click', () => {
        popupOverlay.style.display = 'none'; // Oculta o overlay do pop-up
    });

    // Opcional: Fechar pop-up clicando fora do conteúdo (no overlay)
    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });


    // Função principal de login
    function fazerLogin() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        // --- LÓGICA DE AUTENTICAÇÃO SIMPLIFICADA ---
        if (username === 'admin' && password === 'admin123') { // Credenciais de exemplo
            // Login bem-sucedido:
            popupOverlay.style.display = 'none'; // Oculta o pop-up
            areaDeslogada.style.display = 'none'; // Oculta a área de boas-vindas
            ferramentaGastos.style.display = 'flex'; // Mostra a ferramenta de gastos (usando flex)

            alert('Login bem-sucedido! Bem-vindo(a) à sua ferramenta de gastos.');

            // Armazenar estado de login no localStorage para persistência
            localStorage.setItem('loggedIn', 'true');

        } else {
            // Login falhou:
            loginMessage.textContent = 'Usuário ou senha incorretos.';
            usernameInput.value = '';
            passwordInput.value = '';
        }
    }

    // Função de Logout
    btnLogout.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            ferramentaGastos.style.display = 'none'; // Oculta a ferramenta de gastos
            areaDeslogada.style.display = 'flex'; // Mostra a área de boas-vindas
            popupOverlay.style.display = 'none'; // Garante que o pop-up esteja oculto

            // Remove o estado de login do localStorage
            localStorage.removeItem('loggedIn');

            alert('Você saiu do sistema.');
        }
    });

    // --- Verificação de Estado de Login ao Carregar a Página ---
    window.addEventListener('load', () => {
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn === 'true') {
            areaDeslogada.style.display = 'none';
            ferramentaGastos.style.display = 'flex'; // Usar flex para herdar o alinhamento
        } else {
            areaDeslogada.style.display = 'flex'; // Usar flex para o alinhamento
            ferramentaGastos.style.display = 'none';
            popupOverlay.style.display = 'none'; // Garante que o pop-up esteja oculto no carregamento
        }
    });

    // --- Lógica de Gasto (se você já tiver, mantenha aqui ou ajuste) ---
    const formGasto = document.getElementById('form-gasto');
    const totalGeralSpan = document.getElementById('total-geral');
    const totalUtilSpan = document.getElementById('total-util');
    const totalRemovivelSpan = document.getElementById('total-removivel');
    const totalInvestimentoSpan = document.getElementById('total-investimento');

    let totalGeral = 0;
    let totalUtil = 0;
    let totalRemovivel = 0;
    let totalInvestimento = 0;

    formGasto.addEventListener('submit', (event) => {
        event.preventDefault();

        const descricao = document.getElementById('descricao-gasto').value;
        const valor = parseFloat(document.getElementById('valor-gasto').value);
        const tipo = document.getElementById('tipo-gasto').value;

        if (isNaN(valor) || valor <= 0 || !tipo) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        totalGeral += valor;
        if (tipo === 'util') {
            totalUtil += valor;
        } else if (tipo === 'removivel') {
            totalRemovivel += valor;
        } else if (tipo === 'investimento') {
            totalInvestimento += valor;
        }

        totalGeralSpan.textContent = totalGeral.toFixed(2);
        totalUtilSpan.textContent = totalUtil.toFixed(2);
        totalRemovivelSpan.textContent = totalRemovivel.toFixed(2);
        totalInvestimentoSpan.textContent = totalInvestimento.toFixed(2);

        formGasto.reset();
    });
