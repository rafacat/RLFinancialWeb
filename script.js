document.addEventListener('DOMContentLoaded', () => { // É bom envolver tudo dentro de DOMContentLoaded

    // --- Referências de Elementos ---
    // Header elements
    const headerAuthButtons = document.getElementById('header-auth-buttons');
    const headerLoginBtn = document.getElementById('header-login-btn');
    const headerUserInfo = document.getElementById('header-user-info');
    const userGreeting = document.getElementById('user-greeting');
    const headerLogoutBtnHeader = document.getElementById('header-logout-btn-header');


    // Area Deslogada / Pop-up de Login
    const areaDeslogada = document.getElementById('area-deslogada');
    const btnAbrirPopup = document.getElementById('btn-abrir-popup');
    const popupOverlay = document.getElementById('popup-overlay');
    const btnFecharPopup = document.getElementById('btn-fechar-popup');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('login-message');

    // Ferramenta de Gastos
    const ferramentaGastos = document.getElementById('ferramenta-gastos');
    const btnLogout = document.getElementById('btn-logout'); // Botão Sair dentro da ferramenta


    // --- Variáveis de Estado ---
    let loggedInUser = null; // Para armazenar o nome do usuário logado


    // --- Funções Auxiliares ---

    // Função para atualizar o estado da UI (header, seções)
    function updateUI(isLoggedIn) {
        if (isLoggedIn) {
            // Oculta botões de auth no header, mostra info do usuário
            headerAuthButtons.style.display = 'none';
            headerUserInfo.style.display = 'flex'; // Usar flex para alinhar

            // Atualiza o nome do usuário
            userGreeting.textContent = `Olá, ${loggedInUser || 'Usuário'}!`;

            // Oculta a área deslogada e mostra a ferramenta
            areaDeslogada.style.display = 'none';
            ferramentaGastos.style.display = 'flex'; // Usar flex para centralizar

            // Garante que o pop-up esteja fechado
            popupOverlay.style.display = 'none';

        } else {
            // Mostra botões de auth no header, oculta info do usuário
            headerAuthButtons.style.display = 'flex';
            headerUserInfo.style.display = 'none';

            // Mostra a área deslogada e oculta a ferramenta
            areaDeslogada.style.display = 'flex'; // Usar flex para centralizar
            ferramentaGastos.style.display = 'none';

            // Garante que o pop-up esteja fechado
            popupOverlay.style.display = 'none';
        }
    }


    // --- Funções de Login/Logout ---

    // Função principal de login
    // Esta função será chamada pelo botão "Acessar" do pop-up
    window.fazerLogin = function() { // Exposto globalmente para o onclick no HTML
        const username = usernameInput.value.trim(); // Trim para remover espaços
        const password = passwordInput.value.trim();

        // SIMULAÇÃO DE LOGIN: em um ambiente real, você faria uma requisição para um servidor
        if (username === 'admin' && password === 'admin123') {
            loggedInUser = username; // Armazena o nome do usuário
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', loggedInUser); // Armazena o nome do usuário

            alert('Login bem-sucedido! Bem-vindo(a) à sua ferramenta de gastos.');
            updateUI(true); // Atualiza a UI para o estado logado

        } else {
            loginMessage.textContent = 'Usuário ou senha incorretos.';
            usernameInput.value = '';
            passwordInput.value = '';
        }
    };

    // Função de Logout Comum
    function performLogout() {
        if (confirm('Tem certeza que deseja sair?')) {
            loggedInUser = null; // Limpa o usuário logado
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username'); // Remove o nome do usuário

            alert('Você saiu do sistema.');
            updateUI(false); // Atualiza a UI para o estado deslogado
        }
    }

    // --- Event Listeners ---

    // Cabeçalho: Clicar no botão "Entrar" abre o pop-up
    headerLoginBtn.addEventListener('click', () => {
        popupOverlay.style.display = 'flex';
        loginMessage.textContent = ''; // Limpa mensagem de erro
        usernameInput.value = ''; // Limpa campos
        passwordInput.value = '';
    });

    // Área Deslogada: Clicar no botão "Entrar no Sistema" (principal) abre o pop-up
    btnAbrirPopup.addEventListener('click', () => {
        popupOverlay.style.display = 'flex';
        loginMessage.textContent = ''; // Limpa mensagem de erro
        usernameInput.value = ''; // Limpa campos
        passwordInput.value = '';
    });

    // Pop-up: Fechar (botão X)
    btnFecharPopup.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
    });

    // Pop-up: Fechar (clicar fora do conteúdo)
    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });

    // Botão Sair dentro da Ferramenta de Gastos
    btnLogout.addEventListener('click', performLogout);

    // Botão Sair no Header
    headerLogoutBtnHeader.addEventListener('click', performLogout);


    // --- Inicialização ao Carregar a Página ---
    // Verifica o estado de login ao carregar a página
    window.addEventListener('load', () => {
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        if (isLoggedIn) {
            loggedInUser = localStorage.getItem('username'); // Recupera o nome do usuário
        }
        updateUI(isLoggedIn);
    });


    // --- Lógica de Gasto (já existente, mantida) ---
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

    // Lógica do Podcast (já existente, mantida)
    const readMoreSpans = document.querySelectorAll('.tip-card .read-more');

    readMoreSpans.forEach(span => {
        span.addEventListener('click', (event) => {
            event.preventDefault();
            const parentArticle = event.target.closest('.tip-card');
            if (!parentArticle) return;
            const podcastPlayer = parentArticle.querySelector('.podcast-player');
            const audioPlayer = parentArticle.querySelector('.podcast-player audio');

            if (podcastPlayer) {
                document.querySelectorAll('.podcast-player').forEach(player => {
                    if (player !== podcastPlayer) {
                        player.style.display = 'none';
                        player.querySelector('audio').pause();
                        player.querySelector('audio').currentTime = 0;
                    }
                });

                if (podcastPlayer.style.display === 'none' || podcastPlayer.style.display === '') {
                    podcastPlayer.style.display = 'block';
                    if (audioPlayer) audioPlayer.play();
                } else {
                    podcastPlayer.style.display = 'none';
                    if (audioPlayer) audioPlayer.pause();
                }
            }
        });
    });
});
