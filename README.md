Repositório Central de Materiais Digitais (StudyFlow)
Este projeto consiste numa plataforma de gestão centralizada para recursos educacionais, desenvolvida para otimizar o fluxo de trabalho de conteudistas. A solução integra um sistema de Smart Assist, que utiliza modelos de linguagem de grande escala (LLM) para automatizar a descrição e a categorização técnica dos materiais.

Visão Geral do Sistema
O sistema foi desenhado para ser uma ferramenta ativa no processo de curadoria. Através da análise do título e do tipo de recurso, o motor de Inteligência Artificial gera sugestões pedagógicas precisas, reduzindo o esforço manual e garantindo a padronização metadados do repositório.

Funcionalidades Principais
Gestão de Recursos (CRUD): Controlo total sobre o ciclo de vida dos materiais (PDF, Vídeo, Áudio e Links).

Smart Assist IA: Integração com a API Google Gemini para geração de resumos e tags.

Interface Adaptativa: Design focado na experiência do utilizador com suporte nativo a temas Light e Dark.

Arquitetura de Observabilidade: Monitorização de latência e saúde do sistema em tempo real.

Stack Tecnológica
Backend
Framework: FastAPI (Python 3.10+)

Persistência: SQLite com SQLAlchemy ORM

Validação: Pydantic (Garantia de integridade de tipos)

IA: Google Gemini Pro API / Mock Service

Frontend
Biblioteca: React.js

Estilização: Tailwind CSS (Design System Utilitário)

Iconografia: Lucide React

Comunicação: Axios

Configuração e Instalação
Requisitos Prévios
Python 3.10 ou superior

Node.js 16+

Chave de API do Google Gemini (Opcional - o sistema possui modo Mock)

Instalação do Backend
Aceda ao diretório /backend.

Configure o ambiente virtual: python -m venv venv.

Ative o ambiente:

Windows: venv\Scripts\activate

Linux/Mac: source venv/bin/activate

Instale as dependências: pip install -r requirements.txt.

Crie um ficheiro .env na raiz do backend com a variável: GEMINI_API_KEY=seu_token_aqui.

Execute o servidor: uvicorn main:app --reload.

Instalação do Frontend
Aceda ao diretório /frontend.

Instale os pacotes: npm install.

Inicie o servidor de desenvolvimento: npm run dev.

Observabilidade e DevOps
Para garantir a fiabilidade exigida em ambientes de produção, o projeto implementa:

Logs Estruturados: Todas as interações com o motor de IA são registadas, incluindo o título do recurso, o fornecedor utilizado e a latência da resposta.

Health Check: Endpoint dedicado (/health) para verificação de estado do banco de dados e serviços de rede.

Continuous Integration: Pipeline via GitHub Actions que executa validações de linting (Flake8) a cada novo envio para o repositório.

Considerações sobre o Prompt Engineering
A IA foi instruída através de um System Prompt específico para atuar como um Assistente Pedagógico. O foco das descrições geradas é a clareza técnica e a utilidade direta para o aluno final, evitando linguagens excessivamente comerciais ou genéricas.

Notas Finais
Este projeto foi desenvolvido como parte de um desafio técnico, focando-se em escalabilidade, segurança de dados e integração fluida entre IA e utilizador final.
