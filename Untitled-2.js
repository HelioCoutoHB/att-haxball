
let maxStreak = 10; // Máximo de vitórias consecutivas antes de resetar
let currentStreak = 0; // Sequência atual de vitórias do time RED
let streakPlayers = []; // Jogadores do time RED durante a sequência
let playerScores = {}; // Registro geral de pontuação por jogador

// Função para registrar a vitória
function recordVictory(winningTeam) {
    if (winningTeam === "RED" && room.getPlayerList().filter(p => p.team === 1).length === 3) {
        const currentRedPlayers = room.getPlayerList().filter(p => p.team === 1);

        // Verifica se RED venceu
        if (currentStreak === 0 || streakPlayers.join(",") === currentRedPlayers.map(p => p.name).join(",")) {
            currentStreak++;
            streakPlayers = currentRedPlayers.map(p => p.name);

            // Checa limite de vitórias
            if (currentStreak >= maxStreak) {
                currentRedPlayers.forEach(p => {
                    playerScores[p.name] = (playerScores[p.name] || 0) + 1; // Incrementa pontuação individual
                });
                currentStreak = 0; // Reseta sequência
                streakPlayers = []; // Reseta jogadores da sequência
            }
        } else {
            // Reset caso time mude
            currentStreak = 1;
            streakPlayers = currentRedPlayers.map(p => p.name);
        }
    } else if (winningTeam === "BLUE") {
        // Reset da sequência caso BLUE vença
        currentStreak = 0;
        streakPlayers = [];
    }
}

// Quando um jogador envia uma mensagem no chat
room.onPlayerChat = function(player, message) {
    if (message === "!record") {
        if (currentStreak > 0) {
            room.sendAnnouncement(
                `${streakPlayers.join(", ")} têm ${currentStreak} vitória(s) consecutiva(s). Sequências acumuladas: ${JSON.stringify(playerScores)}`,
                null,
                0x00FF00
            );
        } else {
            room.sendAnnouncement("Ainda não há sequência de vitórias registrada.", null, 0xFF0000);
        }
    }
};
