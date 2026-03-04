

---

# ⚖️ Ouvidoria Digital

Sistema de gestão de satisfação e coleta de feedbacks desenvolvido com **Vue 3**, **Tailwind CSS** e **Supabase**.

## 🚀 Tecnologias

* **Framework:** Vue 3 (Vite)
* **Estilização:** Tailwind CSS
* **Backend:** Supabase (Auth & Database)

## 🛠️ Configuração do Projeto

```sh
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build para produção
npm run build

```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=seu_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

```

## 📊 Estrutura de Dados

Comando para criação da tabela no **Supabase SQL Editor**:

```sql
create table pesquisas (
  id uuid primary key default gen_random_uuid(),
  nome text, 
  cpf text, 
  email text, 
  telefone text,
  rating int4 check (rating >= 1 and rating <= 5), 
  description text, 
  created_at timestamptz default now()
);

```

## 📖 Funcionalidades

* **Portal Público:** Registro de manifestações com máscaras de CPF e Telefone.
* **Área Admin:** Dashboard com busca global, filtros de criticidade e estatísticas de média geral.
* **Interface:** Layout responsivo com modo de alto contraste (Slate & Indigo).

---

