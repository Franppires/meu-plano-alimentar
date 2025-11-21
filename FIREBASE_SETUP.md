# Configuração do Firebase para Login com Google

Este projeto suporta autenticação com Google e armazenamento na nuvem usando Firebase. Se você não configurar o Firebase, o app funcionará normalmente usando localStorage local.

## Passo a Passo para Configurar Firebase

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" ou selecione um projeto existente
3. Siga as instruções para criar o projeto

### 2. Habilitar Autenticação Google

1. No console do Firebase, vá em **Authentication** (Autenticação)
2. Clique em **Get Started** (Começar)
3. Vá na aba **Sign-in method** (Métodos de entrada)
4. Clique em **Google**
5. Ative o toggle e configure:
   - Email de suporte do projeto
   - Nome do projeto público
6. Clique em **Save** (Salvar)

### 3. Criar Banco de Dados Firestore

1. No console do Firebase, vá em **Firestore Database**
2. Clique em **Create database** (Criar banco de dados)
3. Escolha o modo:
   - **Production mode** (modo produção) - mais seguro
   - **Test mode** (modo teste) - para desenvolvimento (permite leitura/escrita por 30 dias)
4. Escolha a localização do servidor (ex: `southamerica-east1` para Brasil)
5. Clique em **Enable** (Habilitar)

### 4. Configurar Regras de Segurança do Firestore

1. Vá em **Firestore Database** > **Rules** (Regras)
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que usuários autenticados leiam e escrevam apenas seus próprios dados
    match /userData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Clique em **Publish** (Publicar)

### 5. Obter Credenciais do Firebase

1. No console do Firebase, vá em **Project Settings** (Configurações do projeto)
   - Clique no ícone de engrenagem ao lado de "Project Overview"
2. Role até a seção **Your apps** (Seus apps)
3. Clique no ícone **Web** (`</>`)
4. Registre o app com um nome (ex: "Meu Plano Saudável")
5. Copie as credenciais que aparecem (firebaseConfig)

### 6. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto (se não existir)
2. Adicione as seguintes variáveis com os valores do seu Firebase:

```env
VITE_FIREBASE_API_KEY=sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

3. **IMPORTANTE**: Adicione `.env.local` ao `.gitignore` para não commitar suas credenciais

### 7. Configurar na Vercel (se estiver usando)

1. Vá nas configurações do seu projeto na Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione todas as variáveis do Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Faça um novo deploy

## Como Funciona

- **Com Firebase configurado**: 
  - Login com Google disponível
  - Dados salvos na nuvem (Firestore)
  - Sincronização entre dispositivos
  - Dados persistem mesmo após limpar cache do navegador

- **Sem Firebase configurado**:
  - Apenas login por nome de usuário
  - Dados salvos localmente (localStorage)
  - Dados apenas no navegador atual

## Testando

1. Inicie o app: `npm run dev`
2. Se o Firebase estiver configurado, você verá o botão "Entrar com Google"
3. Clique no botão e faça login com sua conta Google
4. Seus dados serão salvos automaticamente na nuvem

## Troubleshooting

### Erro: "Firebase não está configurado"
- Verifique se todas as variáveis de ambiente estão definidas
- Certifique-se de que o arquivo `.env.local` existe e está na raiz do projeto
- Reinicie o servidor de desenvolvimento após adicionar variáveis

### Erro ao fazer login com Google
- Verifique se a autenticação Google está habilitada no Firebase Console
- Verifique se o domínio está autorizado nas configurações do Firebase

### Erro ao salvar dados
- Verifique as regras de segurança do Firestore
- Certifique-se de que o usuário está autenticado
- Verifique os logs do console do navegador para mais detalhes

