import os
import time
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

# Configuração de Logs Estruturados
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [SmarAssist] - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# CONFIGURAÇÃO: 
USE_REAL_AI = False 

def sugerir_recursos(titulo, tipo):
    api_key = os.getenv("GEMINI_API_KEY")
    inicio_timer = time.time()

    # Prompt refinado para "Assistente Pedagógico"
    prompt = f"""
    Atue como um Assistente Pedagógico especializado em materiais digitais.
    Analise o material "{titulo}" do tipo "{tipo}".
    
    TAREFA:
    1. DESC: Escreva um resumo técnico, pedagógico e breve (máximo 12 palavras).
    2. TAGS: Liste EXATAMENTE 3 tags técnicas e criativas, separadas por vírgula.
    
    FORMATO OBRIGATÓRIO (NÃO RESPONDA NADA ALÉM DISSO):
    DESC: [Resumo] | TAGS: [tag1, tag2, tag3]
    """

    if USE_REAL_AI and api_key:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {'Content-Type': 'application/json'}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        try:
            response = requests.post(url, json=payload, timeout=10)
            latencia = time.time() - inicio_timer
            
            if response.status_code == 200:
                texto_ia = response.json()['candidates'][0]['content']['parts'][0]['text'].strip()
                
                # Log de Sucesso (Requisito de Observabilidade)
                logger.info(f"AI Request Success: Title='{titulo}', Type='{tipo}', Latency={latencia:.2f}s, Provider='Gemini'")
                return texto_ia
            
            logger.error(f"AI Request Failed: Status={response.status_code}, Latency={latencia:.2f}s")
        except Exception as e:
            logger.error(f"Connection Error: {str(e)}")

    # --- MODO SIMULAÇÃO (MOCK) ---
    time.sleep(1.5) # Simula o tempo de processamento da IA
    latencia_mock = time.time() - inicio_timer
    
    # Lógica de Mock dinâmica
    t = titulo.lower()
    if "python" in t: tags = "Programação, Backend, Python"
    elif "react" in t: tags = "Frontend, JavaScript, Web"
    else: tags = "Educação, Tecnologia, Estudo"

    resumo_mock = f"Estudo dirigido sobre {titulo} focado em competências de {tipo}."
    
    # Log do Mock
    logger.info(f"AI Request (MOCK): Title='{titulo}', Latency={latencia_mock:.2f}s, Mode='Simulation'")
    
    return f"DESC: {resumo_mock} | TAGS: {tags}"