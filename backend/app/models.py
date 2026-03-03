from sqlalchemy import Column, Integer, String, Text
from database import Base

class Recurso(Base):
    __tablename__ = "recursos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255))
    tipo = Column(String(50))
    descricao = Column(Text)  
    tags = Column(String(255))
    link = Column(String, nullable=True)