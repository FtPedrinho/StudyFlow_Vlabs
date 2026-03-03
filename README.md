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

### Resumo dos Comandos Utilizados:

| Comando | Resultado |
| :--- | :--- |
| `# Texto` | Título Principal (H1) |
| `## Texto` | Subtítulo (H2) |
| `**Texto**` | **Negrito** (ênfase forte) |
| `*Texto*` | *Itálico* (ênfase leve) |
| `` `Código` `` | `Texto em fonte monoespaçada` (inline) |
| ` ```bash ` | Bloco de código multi-linha com cor de terminal |
| `* Item` | Lista com marcadores |
| `> Texto` | Bloco de destaque/aviso |
| `---` | Linha divisória horizontal |

### Próximo Passo:
Agora que você tem o texto formatado, basta criar um arquivo chamado **`README.md`** na pasta raiz do seu projeto, colar este conteúdo dentro dele e fazer o `git push`. O GitHub reconhecerá automaticamente e renderizará a página com este visual profissional.

**Gostaria que eu formatasse mais alguma seção específica, como os termos de licença ou contato?**
