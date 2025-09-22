#!/bin/bash

# Cleanup script para Enzel Hub
echo "🧹 Limpando processos duplicados..."

# Kill all node processes related to the project
pkill -f "enzel-hub" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true

# Wait a moment
sleep 2

# Start backend
echo "🚀 Iniciando backend na porta 3001..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment
sleep 3

# Start frontend
echo "🎨 Iniciando frontend na porta 3003..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Processos iniciados:"
echo "   Backend PID: $BACKEND_PID (porta 3001)"
echo "   Frontend PID: $FRONTEND_PID (porta 3003)"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3003"
echo "   Backend API: http://localhost:3001"
echo "   Health Check: http://localhost:3001/health"
echo ""
echo "📝 Login: leonardo@enzelcode.com / frizzi090520"