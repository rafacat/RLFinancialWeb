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
