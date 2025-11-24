# Meu Plano Saudável

Planeje a semana completa com café da manhã, lanches intermediários, almoço e jantar. Controle o inventário, consulte receitas e dicas prontas e gere cardápios personalizados com IA quando quiser.

## Funcionalidades

- Planejador com 5 refeições por dia, horários sugeridos e campos editáveis que ficam salvos no navegador.
- Gerador de plano alimentar: preencha os perfis, clique em “Gerar Plano Alimentar” e aplique o resultado direto no planejador (você pode ajustar depois).
- Inventário organizado por categorias com lista de compras interativa.
- Receitas e dicas de armazenamento com conteúdo pronto e geração dinâmica quando a IA está configurada.

## Executando localmente

**Pré-requisitos:** Node.js 18+

1. Instale as dependências  
   `npm install`
2. (Opcional, porém necessário para planos criados pela IA) Crie o arquivo `.env.local` e informe sua chave:
   ```
   VITE_GEMINI_API_KEY=coloque_sua_chave_aqui
   ```
   Sem a chave, o app continua funcionando com conteúdos padrão de receitas, dicas e cardápio exemplo.
3. Inicie o servidor de desenvolvimento  
   `npm run dev`
