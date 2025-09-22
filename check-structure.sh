#!/bin/bash

echo "🔍 Estrutura atual do projeto Enzel Hub:"
echo ""
echo "📁 Raiz do projeto:"
ls -la /Users/trabalho/Library/CloudStorage/GoogleDrive-sitesfastgroup@gmail.com/Meu\ Drive/github/enzel-hub/ | grep "^d" | awk '{print "   " $9}'

echo ""
echo "📁 Dentro de /frontend:"
ls -la /Users/trabalho/Library/CloudStorage/GoogleDrive-sitesfastgroup@gmail.com/Meu\ Drive/github/enzel-hub/frontend/ | grep "^d" | awk '{print "   " $9}'

echo ""
echo "📁 Dentro de /backend:"
ls -la /Users/trabalho/Library/CloudStorage/GoogleDrive-sitesfastgroup@gmail.com/Meu\ Drive/github/enzel-hub/backend/ | grep "^d" | awk '{print "   " $9}'

echo ""
echo "✅ Estrutura verificada!"