#!/bin/bash

# Script de démarrage du serveur pour Marco Polo
# Usage: ./start-server.sh [port]

PORT=${1:-8000}
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Démarrage du serveur Marco Polo..."
echo "📁 Dossier: $DIR"
echo "🌐 Port: $PORT"
echo ""

# Vérifier si Python 3 est disponible
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 détecté"
    echo "📡 Serveur disponible sur: http://localhost:$PORT"
    echo ""
    echo "📚 Tutoriels disponibles:"
    echo "   - vélo"
    echo "   - marmite norvégienne"
    echo "   - Arduino Bike Lights"
    echo ""
    echo "🛑 Appuyez sur Ctrl+C pour arrêter"
    echo ""
    cd "$DIR"
    python3 -m http.server $PORT
# Vérifier si Python (fallback) est disponible
elif command -v python &> /dev/null; then
    echo "✅ Python détecté"
    echo "📡 Serveur disponible sur: http://localhost:$PORT"
    echo ""
    echo "📚 Tutoriels disponibles:"
    echo "   - vélo"
    echo "   - marmite norvégienne"
    echo "   - Arduino Bike Lights"
    echo ""
    echo "🛑 Appuyez sur Ctrl+C pour arrêter"
    echo ""
    cd "$DIR"
    python -m http.server $PORT
# Vérifier si PHP est disponible
elif command -v php &> /dev/null; then
    echo "✅ PHP détecté"
    echo "📡 Serveur disponible sur: http://localhost:$PORT"
    echo "🛑 Appuyez sur Ctrl+C pour arrêter"
    echo ""
    cd "$DIR"
    php -S localhost:$PORT
# Vérifier si Node.js est disponible
elif command -v npx &> /dev/null; then
    echo "✅ Node.js détecté"
    echo "📡 Installation de http-server si nécessaire..."
    echo "📡 Serveur disponible sur: http://localhost:$PORT"
    echo "🛑 Appuyez sur Ctrl+C pour arrêter"
    echo ""
    cd "$DIR"
    npx http-server -p $PORT
else
    echo "❌ Aucun serveur HTTP trouvé"
    echo ""
    echo "Veuillez installer l'un des suivants:"
    echo "  - Python 3: https://www.python.org/"
    echo "  - PHP: https://www.php.net/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    echo "Ou utilisez l'extension 'Live Server' de VS Code"
    exit 1
fi
