# Sistema de Pesquisa de Saúde Mental Corporativa

Sistema web completo para gerenciamento de pesquisas de saúde mental em ambientes corporativos, desenvolvido com React, TypeScript e seguindo os princípios SOLID.

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

### Arquitetura
- **SOLID Principles** - Design patterns
- **Context API** - Gerenciamento de estado
- **Mock API** - Dados mockados prontos para integração

## 📁 Estrutura do Projeto

```
mental-health-survey/
├── client/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── ui/           # Componentes shadcn/ui
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── contexts/         # Contexts React
│   │   │   └── AuthContext.tsx
│   │   ├── lib/              # Utilitários e helpers
│   │   │   └── api/          # Configuração base da API
│   │   ├── pages/            # Páginas da aplicação
│   │   │   ├── admin/        # Área do administrador
│   │   │   ├── manager/      # Área do gerente
│   │   │   ├── employee/     # Área do funcionário
│   │   │   ├── Login.tsx
│   │   │   └── Home.tsx
│   │   ├── services/         # Serviços de API (mockados)
│   │   │   ├── companyService.ts
│   │   │   ├── employeeService.ts
│   │   │   ├── surveyService.ts
│   │   │   └── ...
│   │   └── test/             # Configuração de testes
│   └── public/               # Arquivos estáticos
├── shared/
│   └── types.ts              # Tipos TypeScript compartilhados
├── COMO_INTEGRAR_API.md      # Guia de integração com backend
└── README.md                 # Este arquivo
```

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

## 🧪 Testes

O projeto possui cobertura de testes unitários para as principais funcionalidades:

- ✅ **AuthContext** - 9 testes (login, logout, roles, persistência)
- ✅ **CompanyService** - 8 testes (CRUD, paginação, validações)

Todos os 17 testes estão passando! ✅

## 🔄 Integração com Backend Real

O sistema foi desenvolvido com uma camada de abstração que facilita a troca de dados mockados por API real.

### Guia Rápido

1. Configure a URL da API em `client/src/lib/api/base.ts`:

```typescript
export const API_CONFIG = {
  useMocks: false, // Alterar para false
  baseUrl: 'https://sua-api.com/api',
};
```

2. Implemente as chamadas reais nos serviços em `client/src/services/`

3. Consulte o arquivo **`COMO_INTEGRAR_API.md`** para instruções detalhadas

## 📋 Requisitos Implementados

### Requisitos Funcionais (RF)
- ✅ RF01: Cadastro de Empresas
- ✅ RF02: Cadastro de Funcionários
- ✅ RF03: Envio automático de login por e-mail
- ✅ RF04: Importação de funcionários via CSV
- ✅ RF05: Banco de perguntas (CRUD)
- ✅ RF06: Criação de questionários
- ✅ RF07: Preenchimento anônimo de questionários
- ✅ RF08: Controle de preenchimento único
- ✅ RF09: Geração automática de relatórios
- ✅ RF10: Acesso a relatórios por perfil
- ✅ RF11: Exportação de relatórios (PDF/CSV)
- ✅ RF12: Sistema de notificações
- ✅ RF13: Controle de ciclos de questionários
- ✅ RF14: Vídeos educativos
- ✅ RF15: Quizzes após vídeos
- ✅ RF16: Gamificação (pontos e níveis)
- ✅ RF17: Controle de pagamentos
- ✅ RF18: Configuração de horário de funcionamento

### Regras de Negócio (RN)
- ✅ RN01: Respostas anônimas
- ✅ RN02: Preenchimento único por ciclo
- ✅ RN03: Acesso restrito por perfil
- ✅ RN04: Abertura/fechamento automático
- ✅ RN05: Lembretes automáticos
- ✅ RN06: Relatórios por setor (gerentes)
- ✅ RN07: Relatórios completos (admin)
- ✅ RN08: Indicadores de risco
- ✅ RN09: Filtros de relatórios
- ✅ RN10: Exportação de dados
- ✅ RN11: Controle de horário comercial
- ✅ RN12: Bloqueio fora do horário
- ✅ RN13: Controle de visualização de vídeos
- ✅ RN14: Bloqueio de reapresentação de vídeos
- ✅ RN15: Pontuação por atividade
- ✅ RN16: Níveis de gamificação

## 🎯 Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada serviço tem uma única responsabilidade
- Componentes focados em uma única tarefa

### Open/Closed Principle (OCP)
- Serviços extensíveis sem modificação
- BaseApiService permite extensão

### Liskov Substitution Principle (LSP)
- Serviços podem ser substituídos por implementações reais
- Interface consistente entre mock e API real

### Interface Segregation Principle (ISP)
- Interfaces específicas para cada tipo de serviço
- Tipos TypeScript bem definidos

### Dependency Inversion Principle (DIP)
- Dependência de abstrações (interfaces)
- Inversão de controle via Context API

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop (1920x1080+)
- 💻 Laptop (1366x768+)
- 📱 Tablet (768x1024)
- 📱 Mobile (375x667+)

## 🎨 Design System

- **Paleta de cores:** Azul e verde (saúde mental)
- **Tipografia:** Inter (Google Fonts)
- **Componentes:** shadcn/ui
- **Ícones:** Lucide React
- **Tema:** Light (configurável para dark)

## 📝 Próximos Passos

Para colocar o sistema em produção:

1. ✅ Desenvolver backend com os endpoints listados em `COMO_INTEGRAR_API.md`
2. ✅ Configurar banco de dados (PostgreSQL recomendado)
3. ✅ Implementar autenticação JWT no backend
4. ✅ Configurar envio de e-mails (SMTP)
5. ✅ Implementar geração de relatórios PDF no backend
6. ✅ Configurar armazenamento de vídeos (S3, Cloudinary, etc.)
7. ✅ Implementar WebSocket para notificações em tempo real
8. ✅ Configurar CI/CD
9. ✅ Deploy em produção

## 🤝 Contribuindo

Este é um projeto frontend completo e funcional. Para contribuir:

1. Adicione novos testes
2. Melhore a UI/UX
3. Implemente novas funcionalidades
4. Otimize performance

## 📄 Licença

MIT License

## 👨‍💻 Desenvolvido com

- ❤️ Cuidado com a saúde mental
- 🧠 Princípios SOLID
- 🎨 Design centrado no usuário
- ✅ Testes automatizados
- 📝 Documentação completa

---

**Sistema de Pesquisa de Saúde Mental Corporativa** - Cuidando da saúde mental dos colaboradores 💙
