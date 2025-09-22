# 🌐 Configuração DNS no Netlify

Após fazer o deploy na AWS, você precisará configurar os subdomínios no Netlify.

## 📝 Passo a Passo

### 1. Fazer Deploy e Obter URLs
```bash
# Execute o deploy primeiro
./deploy.sh

# Isso vai gerar URLs como:
# Backend:  abc123.us-east-1.awsapprunner.com
# Frontend: main.d1234567890.amplifyapp.com
```

### 2. Configurar DNS no Netlify

**Acesse:** [Netlify DNS Dashboard](https://app.netlify.com/teams/YOUR_TEAM/dns/enzelcode.com)

**Adicione estes registros:**

#### Backend (API)
```
Type: CNAME
Name: hubapi
Value: abc123.us-east-1.awsapprunner.com
TTL: 3600
```

#### Frontend (App)
```
Type: CNAME
Name: hub
Value: main.d1234567890.amplifyapp.com
TTL: 3600
```

### 3. Configurar Custom Domain no Amplify

**No Console AWS Amplify:**
1. Vá em **Domain Management**
2. Clique **Add domain**
3. Digite `hub.enzelcode.com`
4. Amplify vai gerar um CNAME validation record
5. Adicione esse CNAME no Netlify também

### 4. Configurar Custom Domain no App Runner

**No Console AWS App Runner:**
1. Vá em **Custom domains**
2. Clique **Link domain**
3. Digite `hubapi.enzelcode.com`
4. App Runner vai gerar validation records
5. Adicione esses records no Netlify

## ✅ Verificação

Após 5-30 minutos:
```bash
# Teste backend
curl https://hubapi.enzelcode.com/health

# Teste frontend
curl https://hub.enzelcode.com
```

## 🚨 Troubleshooting

- **DNS não propaga**: Aguarde até 48h
- **SSL não funciona**: Certifique-se que AWS gerou o certificado
- **Validation falha**: Confira se CNAMEs estão corretos no Netlify

## 📱 URLs Finais

- **Frontend**: https://hub.enzelcode.com
- **Backend API**: https://hubapi.enzelcode.com
- **Health Check**: https://hubapi.enzelcode.com/health