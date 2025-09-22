#!/bin/bash

echo "🎨 Deploy do Frontend - Enzel Hub"
echo "================================="

# Verificar AWS CLI
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI não configurado. Execute 'aws configure' primeiro."
    exit 1
fi

echo "📋 Instruções para Deploy do Frontend:"
echo ""
echo "1. 🌐 Acesse o AWS Amplify Console:"
echo "   https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1"
echo ""
echo "2. 🔗 Clique em 'Create new app' > 'Host web app'"
echo ""
echo "3. 📚 Selecione 'GitHub' como source"
echo ""
echo "4. 🔐 Conecte sua conta GitHub (se necessário)"
echo ""
echo "5. 📂 Selecione o repositório:"
echo "   Repository: enzelcode/enzel-hub"
echo "   Branch: main"
echo ""
echo "6. ⚙️ Configure o app:"
echo "   App name: enzel-hub-frontend"
echo "   Monorepo: Yes"
echo "   Root directory: frontend"
echo ""
echo "7. 🔧 Build settings (será detectado automaticamente):"
echo "   O arquivo amplify.yml já está configurado!"
echo ""
echo "8. 🌍 Environment variables:"
echo "   NEXT_PUBLIC_API_URL = http://localhost:3001 (por enquanto)"
echo ""
echo "9. 🚀 Clique em 'Save and deploy'"
echo ""
echo "⏳ O deploy vai levar 5-10 minutos..."
echo ""
echo "📱 Após o deploy, você receberá uma URL como:"
echo "   https://main.d1234567890.amplifyapp.com"
echo ""
echo "💡 Dica: Mantenha essa URL, vamos usá-la para configurar o DNS!"

read -p "🤔 Quer que eu abra o console do Amplify para você? (y/n): " response
if [[ "$response" == "y" || "$response" == "Y" ]]; then
    open "https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1"
    echo "🌐 Console do Amplify aberto no navegador!"
fi

echo ""
echo "✅ Quando o deploy estiver completo, me avise para configurarmos o domínio!"