# Troubleshooting - Firebase Login

## Problema: Login com Google não funciona

### Passo 1: Verificar se o servidor foi reiniciado

**IMPORTANTE**: Após adicionar/modificar variáveis no `.env.local`, você DEVE reiniciar o servidor!

1. Pare o servidor (Ctrl+C no terminal)
2. Execute novamente: `npm run dev`
3. Aguarde o servidor iniciar completamente

### Passo 2: Verificar o console do navegador

Abra o console do navegador (F12) e procure por mensagens:

- ✅ `Firebase inicializado com sucesso!` = Tudo OK
- ⚠️ `Firebase não configurado` = Variáveis não estão sendo lidas
- ❌ `Erro ao inicializar Firebase` = Problema com as credenciais

### Passo 3: Verificar o arquivo .env.local

O arquivo deve estar na **raiz do projeto** (mesma pasta do `package.json`):

```
Meu plano saudável/
├── .env.local          ← DEVE ESTAR AQUI
├── package.json
├── App.tsx
└── ...
```

### Passo 4: Verificar formato do .env.local

O arquivo deve ter este formato (sem aspas, sem espaços extras):

```env
VITE_FIREBASE_API_KEY=AIzaSyAk2xosxA_11HIDt6NUWxlc4PZQyk3ah_g
VITE_FIREBASE_AUTH_DOMAIN=meu-plano-saudavel.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=meu-plano-saudavel
VITE_FIREBASE_STORAGE_BUCKET=meu-plano-saudavel.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=730603555822
VITE_FIREBASE_APP_ID=1:730603555822:web:bc0476be77aeea83515cff
```

**NÃO use:**
- ❌ Aspas: `VITE_FIREBASE_API_KEY="AIzaSy..."`
- ❌ Espaços: `VITE_FIREBASE_API_KEY = AIzaSy...`
- ❌ Vírgulas ou ponto e vírgula

### Passo 5: Verificar se o botão aparece

Se o botão "Entrar com Google" **não aparece**, significa que:
- As variáveis não estão sendo lidas
- O Firebase não está configurado corretamente
- Verifique o console do navegador para mensagens de debug

### Passo 6: Erros comuns

#### Erro: "Firebase: Error (auth/configuration-not-found)"
- **Causa**: Variáveis não estão sendo carregadas
- **Solução**: Reinicie o servidor após modificar `.env.local`

#### Erro: "Popup bloqueado"
- **Causa**: Navegador bloqueou o popup
- **Solução**: Permita popups para o site

#### Erro: "Login cancelado"
- **Causa**: Usuário fechou a janela de login
- **Solução**: Tente novamente

### Passo 7: Testar manualmente

Abra o console do navegador e execute:

```javascript
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
```

Se aparecer `undefined`, as variáveis não estão sendo carregadas.

### Passo 8: Verificar Firebase Console

1. Acesse https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em **Authentication** > **Sign-in method**
4. Verifique se **Google** está **habilitado**

### Passo 9: Limpar cache

Se nada funcionar:

1. Pare o servidor
2. Delete a pasta `node_modules/.vite` (se existir)
3. Reinicie o servidor: `npm run dev`

### Ainda não funciona?

1. Verifique os logs no console do navegador
2. Verifique os logs no terminal do servidor
3. Certifique-se de que todas as variáveis estão corretas
4. Tente fazer login por nome de usuário (deve funcionar sempre)

