# Como Integrar com API Real

Este documento explica como substituir os mocks por chamadas reais à API backend.

## Estrutura Atual

O sistema foi desenvolvido seguindo os princípios SOLID com uma arquitetura que facilita a troca entre dados mockados e API real.

### Arquivos Principais

- **`client/src/lib/api/base.ts`**: Classe base para todos os serviços
- **`client/src/services/`**: Serviços específicos para cada entidade
- **`shared/types.ts`**: Tipos TypeScript compartilhados

## Passo a Passo para Integração

### 1. Configurar URL da API

Edite o arquivo `client/src/lib/api/base.ts`:

```typescript
export const API_CONFIG = {
  useMocks: false, // Alterar para false
  mockDelay: 500,
  baseUrl: 'https://sua-api.com/api', // URL da sua API real
};
```

### 2. Implementar Chamadas Reais

Cada serviço em `client/src/services/` tem métodos comentados com `// TODO: Implementar chamada real à API`.

#### Exemplo: CompanyService

**Antes (Mock):**
```typescript
async getAll(params?: PaginationParams): Promise<PaginatedResponse<Company>> {
  if (shouldUseMocks()) {
    await this.delay();
    return this.paginate(this.mockData, params);
  }
  
  // TODO: Implementar chamada real à API
  throw new Error('API real não implementada');
}
```

**Depois (API Real):**
```typescript
async getAll(params?: PaginationParams): Promise<PaginatedResponse<Company>> {
  if (shouldUseMocks()) {
    await this.delay();
    return this.paginate(this.mockData, params);
  }
  
  const queryParams = new URLSearchParams({
    page: params?.page?.toString() || '1',
    limit: params?.limit?.toString() || '10',
  });
  
  const response = await fetch(`${this.baseUrl}/companies?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar empresas');
  }
  
  return await response.json();
}
```

### 3. Autenticação JWT

O sistema já está preparado para usar JWT. O token é armazenado em `localStorage` com a chave `auth_token`.

#### Modificar AuthContext

Edite `client/src/contexts/AuthContext.tsx` para fazer login real:

```typescript
const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Email ou senha inválidos');
  }

  const data: AuthResponse = await response.json();
  
  localStorage.setItem(AUTH_STORAGE_KEY, data.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
  
  setUser(data.user);
};
```

### 4. Tratamento de Erros

Adicione tratamento de erros adequado:

```typescript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }
  
  return await response.json();
} catch (error) {
  console.error('Erro na API:', error);
  throw error;
}
```

### 5. Interceptor para Token

Crie um helper para adicionar token automaticamente:

```typescript
// client/src/lib/api/fetch-with-auth.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Token expirado, redirecionar para login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
    throw new Error('Sessão expirada');
  }
  
  return response;
}
```

## Endpoints Esperados pela API

### Autenticação
- `POST /auth/login` - Login
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: User }`

### Empresas (RF01)
- `GET /companies` - Listar empresas
- `GET /companies/:id` - Buscar empresa
- `POST /companies` - Criar empresa
- `PUT /companies/:id` - Atualizar empresa
- `DELETE /companies/:id` - Excluir empresa

### Funcionários (RF02)
- `GET /employees` - Listar funcionários
- `POST /employees` - Criar funcionário
- `POST /employees/import` - Importar CSV
- `PUT /employees/:id` - Atualizar funcionário
- `DELETE /employees/:id` - Excluir funcionário

### Perguntas (RF05)
- `GET /questions` - Listar perguntas
- `POST /questions` - Criar pergunta
- `PUT /questions/:id` - Atualizar pergunta
- `DELETE /questions/:id` - Excluir pergunta

### Questionários (RF06)
- `GET /surveys` - Listar questionários
- `POST /surveys` - Criar questionário
- `PUT /surveys/:id` - Atualizar questionário
- `DELETE /surveys/:id` - Excluir questionário

### Respostas (RF07, RF08)
- `POST /surveys/:id/responses` - Enviar resposta anônima
- `GET /surveys/:id/responses` - Listar respostas (admin/gerente)

### Relatórios (RF09, RF10, RF11)
- `GET /reports` - Listar relatórios
- `GET /reports/:id` - Buscar relatório
- `GET /reports/:id/export/pdf` - Exportar PDF
- `GET /reports/:id/export/csv` - Exportar CSV

### Vídeos (RF14)
- `GET /videos` - Listar vídeos
- `POST /videos` - Criar vídeo
- `POST /videos/:id/watch` - Registrar visualização

### Notificações (RF12)
- `GET /notifications` - Listar notificações
- `PUT /notifications/:id/read` - Marcar como lida

### Dashboard
- `GET /dashboard/admin` - Stats do admin
- `GET /dashboard/manager` - Stats do gerente
- `GET /dashboard/employee` - Stats do funcionário

## Testando a Integração

### 1. Modo Híbrido

Você pode manter alguns serviços mockados enquanto testa outros:

```typescript
// Em cada serviço individual
async getAll() {
  // Forçar mock apenas para este serviço
  const useMock = true; // ou false para testar API real
  
  if (useMock) {
    return this.paginate(this.mockData);
  }
  
  // Chamada real
  const response = await fetch(...);
  return await response.json();
}
```

### 2. Variáveis de Ambiente

Use variáveis de ambiente para controlar o modo:

```typescript
// .env
VITE_USE_MOCKS=false
VITE_API_URL=https://sua-api.com/api

// base.ts
export const API_CONFIG = {
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
  baseUrl: import.meta.env.VITE_API_URL || '/api',
};
```

## Credenciais de Teste Mockadas

### Administrador
- **Email:** admin@empresa.com
- **Senha:** admin123

### Gerente
- **Email:** gerente@empresa.com
- **Senha:** gerente123

### Funcionário
- **Email:** funcionario@empresa.com
- **Senha:** func123

## Próximos Passos

1. Implementar backend com os endpoints listados
2. Configurar CORS no backend
3. Implementar refresh token (opcional)
4. Adicionar retry logic para requisições falhadas
5. Implementar cache de dados (opcional)
6. Adicionar loading states globais
7. Implementar WebSocket para notificações em tempo real (opcional)

## Suporte

Para dúvidas sobre a arquitetura do frontend, consulte os comentários nos arquivos de serviço.
