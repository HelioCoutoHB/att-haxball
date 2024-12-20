let maxStreak = 10; // Máximo de vitórias consecutivas antes de resetar
let currentStreak = 0; // Sequência atual de vitórias do time RED
let playerScores = {}; // Registro geral de pontuação por jogador

// Função para registrar a vitória
function recordVictory(winningTeam) {
    if (winningTeam === "RED" && room.getPlayerList().filter(p => p.team === 1).length === 3) {
        currentStreak++; // Incrementa sequência de vitórias

        // Checa limite de vitórias
        if (currentStreak >= maxStreak) {
            const currentRedPlayers = room.getPlayerList().filter(p => p.team === 1);
            currentRedPlayers.forEach(p => {
                playerScores[p.name] = (playerScores[p.name] || 0) + 1; // Incrementa pontuação individual
            });

            currentStreak = 0; // Reseta sequência após atingir o limite
        }
    } else if (winningTeam === "BLUE") {
        // Reset da sequência caso BLUE vença
        currentStreak = 0;
    }
}

// Quando um jogador envia uma mensagem no chat
room.onPlayerChat = function(player, message) {
    if (message === "!record") {
        if (currentStreak > 0) {
            room.sendAnnouncement(
                `O time RED tem ${currentStreak} vitória(s) consecutiva(s). Pontuações acumuladas: ${JSON.stringify(playerScores)}`,
                null,
                0x00FF00
            );
        } else {
            room.sendAnnouncement("Ainda não há sequência de vitórias registrada.", null, 0xFF0000);
        }
    }
};
