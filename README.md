# Enzel Hub

Sistema interno da Enzel Code para gestão de clientes e serviços.

## Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- TypeScript
- Express
- JWT Authentication
- AWS DynamoDB

### Infrastructure
- AWS EC2
- Docker
- Terraform

## Design System

**Fonte:** Manrope
**Cores:**
- Verde: #a1ff66
- Branco: #f6f6f6
- Preto: #131e1f

## Estrutura do Projeto

```
├── frontend/          # Next.js application
├── backend/           # Node.js API
├── infrastructure/    # Terraform configs
└── docs/             # Documentation
```

## Desenvolvimento

### Pré-requisitos
- Node.js 18+
- Docker
- AWS CLI configurado
- Terraform

### Setup Local
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```