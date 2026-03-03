from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ai_service import sugerir_recursos

# Configuração do Banco de Dados
DATABASE_URL = "sqlite:///./hub_recursos.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo do Banco (Tabela recursos)
class RecursoDB(Base):
    __tablename__ = "recursos"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    tipo = Column(String)
    link = Column(String, nullable=True)
    descricao = Column(String)
    tags = Column(String)

Base.metadata.create_all(bind=engine)

# Para a sugestão inicial
class RecursoCreate(BaseModel):
    titulo: str
    tipo: str
    link: Optional[str] = None

# Para o cadastro final
class RecursoFinal(BaseModel):
    titulo: str
    tipo: str
    link: Optional[str] = None
    descricao_manual: str
    tags_manuais: str

# Para a resposta ao Frontend
class RecursoResponse(BaseModel):
    id: int
    titulo: str
    tipo: str
    link: Optional[str]
    descricao: str
    tags: str

    class Config:
        from_attributes = True

# Para a edição de cards existentes
class RecursoUpdate(BaseModel):
    descricao: str
    tags: str

# --- APP FASTAPI ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROTA 1: Apenas gera sugestão com IA (usado pelo botão amarelo no frontend)
@app.post("/sugerir")
def sugerir_metadados(recurso: RecursoCreate):
    # Chama a lógica no ai_service.py
    resultado_ia = sugerir_recursos(recurso.titulo, recurso.tipo)
    try:
        # Tenta separar a resposta baseada no formato DESC: ... | TAGS: ...
        partes = resultado_ia.split("|")
        resumo = partes[0].replace("DESC:", "").strip()
        tags = partes[1].replace("TAGS:", "").strip()
        return {"descricao": resumo, "tags": tags}
    except Exception as e:
        # Fallback caso a IA falhe ou mude o formato
        return {
            "descricao": "Falha ao gerar resumo automático.",
            "tags": "Geral, Estudo"
        }

# ROTA 2: Salva definitivamente o material no banco de dados
@app.post("/smart-assist", response_model=RecursoResponse)
def salvar_recurso(recurso: RecursoFinal):
    # Validação de segurança para campos vazios
    if not recurso.descricao_manual.strip() or not recurso.tags_manuais.strip():
        raise HTTPException(status_code=400, detail="Descrição e Tags não podem ser vazias.")

    db = SessionLocal()
    try:
        novo_recurso = RecursoDB(
            titulo=recurso.titulo,
            tipo=recurso.tipo,
            link=recurso.link,
            descricao=recurso.descricao_manual,
            tags=recurso.tags_manuais
        )
        db.add(novo_recurso)
        db.commit()
        db.refresh(novo_recurso)
        return novo_recurso
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar no banco de dados.")
    finally:
        db.close()

# ROTA 3: Listagem geral
@app.get("/recursos", response_model=List[RecursoResponse])
def listar_recursos():
    db = SessionLocal()
    recursos = db.query(RecursoDB).all()
    db.close()
    return recursos

# ROTA 4: Atualização de card existente
@app.put("/recursos/{id}", response_model=RecursoResponse)
def atualizar_recurso(id: int, update_data: RecursoUpdate):
    db = SessionLocal()
    recurso = db.query(RecursoDB).filter(RecursoDB.id == id).first()
    
    if not recurso:
        db.close()
        raise HTTPException(status_code=404, detail="Recurso não encontrado")
    
    recurso.descricao = update_data.descricao
    recurso.tags = update_data.tags
    
    db.commit()
    db.refresh(recurso)
    db.close()
    return recurso

@app.delete("/recursos/{id}")
def deletar_recurso(id: int):
    db = SessionLocal()
    recurso = db.query(RecursoDB).filter(RecursoDB.id == id).first()
    if not recurso:
        db.close()
        raise HTTPException(status_code=404, detail="Recurso não encontrado")
    
    db.delete(recurso)
    db.commit()
    db.close()
    return {"status": "sucesso", "id": id}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)