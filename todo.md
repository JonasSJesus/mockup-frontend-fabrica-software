# Project TODO

## Infraestrutura e Arquitetura
- [x] Configurar estrutura de pastas seguindo SOLID
- [x] Criar tipos TypeScript para entidades do sistema
- [x] Configurar tema e estilos globais
- [x] Criar layout base com navegação

## Autenticação e Controle de Acesso
- [x] Implementar sistema de autenticação mockado com JWT
- [x] Criar tela de login
- [x] Implementar proteção de rotas por role (admin, gerente, funcionário)
- [x] Criar context de autenticação
- [x] Implementar logout

## Helpers de API (Mockados)
- [x] Criar helper de autenticação (login, logout, verificar token)
- [x] Criar helper de empresas (CRUD)
- [x] Criar helper de funcionários (CRUD, importação CSV)
- [x] Criar helper de perguntas (CRUD)
- [x] Criar helper de questionários (CRUD, controle de ciclo)
- [x] Criar helper de respostas (envio anônimo, listagem)
- [x] Criar helper de relatórios (geração, exportação PDF/CSV)
- [x] Criar helper de vídeos (listagem, controle de visualização)
- [x] Criar helper de gamificação (pontuação, progresso)
- [x] Criar helper de notificações
- [x] Criar helper de pagamentos

## Área do Administrador
- [x] Dashboard com gráficos consolidados
- [x] Tela de cadastro de empresas (listagem, criação, edição, exclusão)
- [x] Tela de cadastro de funcionários (listagem, criação, edição, exclusão)
- [x] Tela de importação de funcionários via CSV
- [x] Tela de banco de perguntas (CRUD)
- [x] Tela de criação de questionários
- [x] Tela de controle de ciclos de questionários
- [x] Tela de visualização de relatórios completos
- [x] Tela de exportação de relatórios (PDF/CSV)
- [x] Tela de controle de pagamentos
- [x] Tela de configuração de horário de funcionamento
- [x] Tela de gerenciamento de vídeos educativos
- [x] Tela de configuração de quizzes

## Área do Gerente
- [x] Dashboard com relatórios do setor
- [x] Tela de visualização de relatórios do setor
- [x] Tela de exportação de relatórios do setor

## Área do Funcionário
- [x] Dashboard com vídeos educativos e progresso
- [x] Tela de preenchimento de questionário
- [x] Tela de visualização de vídeos educativos
- [x] Tela de quizzes
- [x] Tela de progresso e gamificação

## Funcionalidades Transversais
- [x] Sistema de notificações (toast/modal)
- [x] Componente de confirmação antes de ações críticas
- [x] Componente de loading states
- [x] Tratamento de erros global
- [x] Validação de formulários
- [x] Componentes reutilizáveis (tabelas, cards, gráficos)

## Testes e Refinamentos
- [x] Testar fluxo de login e proteção de rotas (9 testes unitários)
- [x] Testar fluxo completo do administrador
- [x] Testar fluxo completo do gerente
- [x] Testar fluxo completo do funcionário
- [x] Verificar responsividade em dispositivos móveis
- [x] Verificar acessibilidade (WCAG 2.1)
- [x] Refinar usabilidade e feedback visual
- [x] Adicionar estados vazios (empty states)
- [x] Adicionar micro-interações

## Documentação
- [x] Documentar estrutura de pastas (README.md)
- [x] Documentar helpers de API e como substituir mocks (COMO_INTEGRAR_API.md)
- [x] Documentar usuários e senhas mockados (README.md + Login.tsx)
- [x] Documentar fluxos principais do sistema (README.md)


## Progresso Atual
- [x] Configurar estrutura de pastas seguindo SOLID
- [x] Criar tipos TypeScript para entidades do sistema
- [x] Configurar tema e estilos globais
- [x] Implementar sistema de autenticação mockado com JWT
- [x] Criar tela de login
- [x] Criar context de autenticação
- [x] Criar componente de proteção de rotas


## Novas Funcionalidades - Funcionário e Gerente

### Área do Funcionário - Expansão
- [x] Dashboard com cards interativos e dados reais
- [x] Sistema de notificações com badge de contagem
- [x] Questionários pendentes com countdown de prazo
- [x] Histórico de questionários respondidos
- [x] Player de vídeo integrado com controle de progresso
- [x] Sistema de quizzes após vídeos
- [x] Página de gamificação com níveis, pontos e conquistas
- [x] Ranking de pontuação
- [x] Perfil do usuário com estatísticas

### Área do Gerente - Expansão
- [x] Dashboard com gráficos e métricas do setor
- [x] Filtros de período para relatórios
- [x] Visualização de taxa de resposta
- [x] Gráficos de indicadores de saúde mental
- [x] Exportação de relatórios em PDF/CSV
- [x] Lista de funcionários do setor
- [x] Alertas de funcionários em risco


## Correções e Melhorias

- [x] Corrigir redirecionamento de funcionário após login
- [x] Adicionar página de gamificação ao dashboard do funcionário
- [x] Melhorar feedback visual no login
