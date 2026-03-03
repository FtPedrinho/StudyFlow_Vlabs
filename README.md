# Repositório Central de Materiais Digitais (StudyFlow)
---
## Visão Geral do Sistema
Este projeto consiste numa plataforma de **gestão centralizada** para recursos educacionais. A solução integra um sistema de **Smart Assist**, que utiliza modelos de linguagem (*LLM*) para automatizar a descrição técnica dos materiais.


### Funcionalidades Principais
* **Gestão de Recursos (CRUD):** Controlo total sobre o ciclo de vida dos materiais.
* **Smart Assist IA:** Integração com a API Google Gemini.
* **Interface Adaptativa:** Suporte nativo a temas *Light* e *Dark*.
---

## Stack Tecnológica

| Componente | Tecnologia | Função |
| :--- | :--- | :--- |
| **Frontend** | React.js | Interface do Utilizador (SPA) |
| **Backend** | FastAPI | API RESTful e Lógica de Negócio |
| **Base de Dados** | SQLite | Persistência de Dados Relacionais |
| **IA** | Google Gemini | Motor de Processamento de Linguagem |


---

## Configuração e Instalação

> **Nota:** Certifique-se de que tem o Python 3.10+ e o Node.js instalados antes de começar.
### Instalação do Backend

Para configurar o servidor, execute os seguintes comandos no terminal:

```bash
# Aceder ao diretório
cd backend

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```
---
## Observabilidade e DevOps
Para garantir a fiabilidade exigida, o projeto implementa:

**Logs Estruturados:** Registo de latência e sucesso das chamadas de IA.

**Health Check:** Endpoint */health* para monitorização.

**CI Pipeline:** Automatização via GitHub Actions.

## Considerações Finais

Este repositório foi estruturado seguindo as melhores práticas de Clean Code e Separation of Concerns, garantindo um código modular e de fácil manutenção.
---
## Como Executar o Projeto

Siga as etapas abaixo para configurar o ambiente de desenvolvimento local.

### 1. Configuração do Backend (Python/FastAPI)

O servidor backend gerencia o banco de dados SQLite e a integração com a API de IA.

1.  **Aceda ao diretório:** `cd backend`
2.  **Crie um ambiente virtual:**
    ```bash
    python -m venv venv
    ```
3.  **Ative o ambiente:**
    * Windows: `venv\Scripts\activate`
    * Linux/macOS: `source venv/bin/activate`
4.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Variáveis de Ambiente:**
    Crie um ficheiro `.env` na raiz da pasta `backend` e adicione a sua chave conforme a pasta `.env.examplo`:
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    ```
6.  **Inicie o servidor:**
    ```bash
    uvicorn main:app --reload
    ```
    *O backend estará disponível em: `http://127.0.0.1:8000`*



---

### 2. Configuração do Frontend (React/Vite)

A interface web permite a gestão dos recursos e interação com o Smart Assist.

1.  **Aceda ao diretório:** `cd frontend-react`
2.  **Instale as dependências do Node:**
    ```bash
    npm install
    ```
3.  **Inicie a aplicação:**
    ```bash
    npm run dev
    ```
4.  **Aceda ao sistema:**
    Abra o navegador em: `http://localhost:5173`



---

### 3. Verificação de Saúde (Observabilidade)

Para validar se o sistema está operacional, pode aceder aos seguintes endpoints:

* **API Health Check:** `http://127.0.0.1:8000/health` (Retorna o estado do banco e IA).
* **Documentação Automática:** `http://127.0.0.1:8000/docs` (Interface Swagger para testes de API).

---
