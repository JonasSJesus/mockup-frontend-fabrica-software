# Sistema de Pesquisa de Saúde Mental Corporativa

Sistema web mockup para gerenciamento de pesquisas de saúde mental em ambientes corporativos, desenvolvido com React, TypeScript e seguindo os princípios SOLID.

## 🎯 Visão Geral

Este sistema permite que empresas realizem pesquisas periódicas sobre a saúde mental de seus colaboradores, oferecendo:

- **Anonimato garantido** nas respostas dos funcionários
- **Relatórios automáticos** com indicadores e gráficos
- **Vídeos educativos** com sistema de gamificação
- **Controle de acesso** por perfil (Admin, Gerente, Funcionário)
- **Notificações automáticas** para lembretes de questionários

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes UI
- **Wouter** - Roteamento
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **Vitest** - Testes unitários

## 🔐 Credenciais de Teste

O sistema possui autenticação mockada com as seguintes credenciais:

### Administrador
- **Email:** admin@empresa.com
- **Senha:** admin123
- **Acesso:** Todas as funcionalidades do sistema

### Gerente
- **Email:** gerente@empresa.com
- **Senha:** gerente123
- **Acesso:** Relatórios e dados do seu setor

### Funcionário
- **Email:** funcionario@empresa.com
- **Senha:** func123
- **Acesso:** Responder questionários e assistir vídeos

## 🎨 Funcionalidades por Perfil

### 👨‍💼 Administrador
- ✅ Cadastro de empresas (CRUD completo)
- ✅ Cadastro de funcionários (CRUD + importação CSV)
- ✅ Banco de perguntas (múltipla escolha, escala, texto livre, sim/não)
- ✅ Criação e gerenciamento de questionários
- ✅ Controle de ciclos (abertura/fechamento automático)
- ✅ Relatórios completos com gráficos
- ✅ Exportação de relatórios (PDF/CSV)
- ✅ Gerenciamento de vídeos educativos
- ✅ Configuração de quizzes
- ✅ Controle de pagamentos
- ✅ Configuração de horário de funcionamento

### 👔 Gerente
- ✅ Dashboard com métricas do setor
- ✅ Relatórios filtrados por setor
- ✅ Exportação de relatórios do setor
- ✅ Visualização de taxa de resposta

### 👤 Funcionário
- ✅ Dashboard personalizado
- ✅ Preenchimento de questionários (anônimo)
- ✅ Biblioteca de vídeos educativos
- ✅ Sistema de gamificação (pontos e níveis)
- ✅ Quizzes após vídeos
- ✅ Notificações de lembretes

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 22+
- pnpm 10+

### Instalação

```bash
# Clone o repositório (se aplicável)
git clone <repository-url>

# Entre no diretório
cd mental-health-survey

# Instale as dependências
pnpm install
```

### Executar em Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
pnpm dev

# Acesse http://localhost:3000
```

### Executar Testes

```bash
# Executar todos os testes
pnpm test run

# Executar testes em modo watch
pnpm test

# Executar testes com UI
pnpm test:ui
```

### Build para Produção

```bash
# Gerar build otimizado
pnpm build

# Iniciar em produção
pnpm start
```

## 📝 Próximos Passos

1. ✅ Desenvolver backend com os endpoints listados em `COMO_INTEGRAR_API.md`
2. ✅ Configurar banco de dados (PostgreSQL recomendado)
3. ✅ Implementar autenticação JWT no backend
4. ✅ Configurar envio de e-mails (SMTP)
5. ✅ Implementar geração de relatórios PDF no backend
6. ✅ Configurar armazenamento de vídeos (S3, Cloudinary, etc.)
7. ✅ Implementar WebSocket para notificações em tempo real
8. ✅ Configurar CI/CD
9. ✅ Deploy em produção

---

**Sistema de Pesquisa de Saúde Mental Corporativa** - Cuidando da saúde mental dos colaboradores 💙
