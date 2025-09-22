# 🚀 Deploy do Enzel Hub na AWS

Este guia explica como fazer o deploy do Enzel Hub usando AWS App Runner (backend) e AWS Amplify (frontend).

## 📋 Pré-requisitos

- AWS CLI configurado (`aws configure`)
- Repositório GitHub com o código
- Domínio `enzelcode.com` configurado

## 🔧 Método 1: Deploy Automático (Recomendado)

### 1. Configure o repositório GitHub
```bash
# Adicione e faça commit de todos os arquivos
git add .
git commit -m "feat: setup deployment configs"
git push origin main
```

### 2. Execute o script de deploy
```bash
# Edite o GITHUB_REPO_URL no script primeiro
./deploy.sh
```

## 🛠️ Método 2: Deploy Manual

### Backend (App Runner)

1. **Criar serviço App Runner:**
```bash
aws apprunner create-service \
    --service-name "enzel-hub-backend" \
    --source-configuration '{
        "CodeRepository": {
            "RepositoryUrl": "https://github.com/SEU_USUARIO/enzel-hub.git",
            "SourceCodeVersion": {"Type": "BRANCH", "Value": "main"},
            "CodeConfiguration": {
                "ConfigurationSource": "REPOSITORY"
            }
        },
        "AutoDeploymentsEnabled": true
    }' \
    --instance-configuration '{
        "Cpu": "0.25 vCPU",
        "Memory": "0.5 GB"
    }'
```

2. **Configurar variáveis de ambiente:**
```bash
# No console AWS App Runner, adicione:
NODE_ENV=production
PORT=3001
JWT_SECRET=seu-jwt-secret-super-secreto
AWS_REGION=us-east-1
```

### Frontend (Amplify)

1. **Criar app Amplify:**
```bash
aws amplify create-app \
    --name "enzel-hub-frontend" \
    --repository "https://github.com/SEU_USUARIO/enzel-hub.git"
```

2. **Criar branch:**
```bash
aws amplify create-branch \
    --app-id "SEU_APP_ID" \
    --branch-name "main"
```

3. **Configurar variáveis de ambiente:**
```bash
# No console AWS Amplify, adicione:
NEXT_PUBLIC_API_URL=https://SUA_URL_DO_APPRUNNER
```

## 🌐 DNS Configuration

### 1. Backend (hubapi.enzelcode.com)
```
Type: CNAME
Name: hubapi
Value: SEU_APPRUNNER_URL
```

### 2. Frontend (hub.enzelcode.com)
```
Type: CNAME
Name: hub
Value: SEU_AMPLIFY_URL
```

## 🔍 Verificação

### 1. Teste o backend:
```bash
curl https://hubapi.enzelcode.com/health
```

### 2. Teste o frontend:
```bash
curl https://hub.enzelcode.com
```

## 📊 Monitoramento

- **App Runner**: Console AWS → App Runner → Services
- **Amplify**: Console AWS → Amplify → Apps
- **Logs**: CloudWatch Logs

## 🔧 Troubleshooting

### Backend não inicia:
- Verifique logs no CloudWatch
- Confirme variáveis de ambiente
- Teste build local: `npm run build`

### Frontend não carrega:
- Verifique build no Amplify Console
- Confirme NEXT_PUBLIC_API_URL
- Teste build local: `npm run build`

### Problemas de CORS:
- Verifique CORS_ORIGINS no backend
- Confirme domínios SSL (https://)

## 💰 Custos Estimados

- **App Runner**: ~$7-15/mês (0.25 vCPU, 0.5GB)
- **Amplify**: ~$1-5/mês (build + hosting)
- **DynamoDB**: Pay per use (~$1-10/mês)

**Total estimado: $10-30/mês**