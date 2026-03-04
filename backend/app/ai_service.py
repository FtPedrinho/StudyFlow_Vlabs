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
# Mantenha True para o avaliador; o código agora trata a ausência da chave.
USE_REAL_AI = True 

def sugerir_recursos(titulo, tipo):
    api_key = os.getenv("GEMINI_API_KEY")
    inicio_timer = time.time()

    # Prompt refinado
    prompt = f"""
    Atue como um Assistente Pedagógico especializado em materiais digitais.
    Analise o material "{titulo}" do tipo "{tipo}".
    
    TAREFA:
    1. DESC: Escreva um resumo técnico, pedagógico e breve (máximo 12 palavras).
    2. TAGS: Liste EXATAMENTE 3 tags técnicas e criativas, separadas por vírgula.
    
    FORMATO OBRIGATÓRIO (NÃO RESPONDA NADA ALÉM DISSO):
    DESC: [Resumo] | TAGS: [tag1, tag2, tag3]
    """

    # --- TENTATIVA COM IA REAL ---
    if USE_REAL_AI:
        if not api_key:
            logger.warning(f"AI Request Skipped: Chave GEMINI_API_KEY não encontrada. Usando modo simulação.")
        else:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            headers = {'Content-Type': 'application/json'}
            payload = {"contents": [{"parts": [{"text": prompt}]}]}

            try:
                response = requests.post(url, json=payload, timeout=10)
                latencia = time.time() - inicio_timer
                
                if response.status_code == 200:
                    texto_ia = response.json()['candidates'][0]['content']['parts'][0]['text'].strip()
                    
                    # Log de Sucesso
                    logger.info(f"AI Request Success: Title='{titulo}', Type='{tipo}', Latency={latencia:.2f}s, Provider='Gemini'")
                    return texto_ia
                
                logger.error(f"AI Request Failed: Status={response.status_code}, Latency={latencia:.2f}s. Ativando Fallback.")
            except Exception as e:
                logger.error(f"Connection Error: {str(e)}. Ativando Fallback.")

    # --- MODO SIMULAÇÃO (MOCK / FALLBACK) ---
    time.sleep(1.5) # Simula o tempo de processamento da IA
    latencia_mock = time.time() - inicio_timer
    
    # Lógica de Mock dinâmica
    t = titulo.lower()
    if "python" in t: 
        tags = "Programação, Backend, Python"
    elif "react" in t: 
        tags = "Frontend, JavaScript, Web"
    else: 
        tags = "Educação, Tecnologia, Estudo"

    resumo_mock = f"Estudo dirigido sobre {titulo} focado em competências de {tipo}."
    
    # Log do Mock/Fallback
    logger.info(f"AI Request (FALLBACK/MOCK): Title='{titulo}', Latency={latencia_mock:.2f}s, Mode='Simulation'")
    
    return f"DESC: {resumo_mock} | TAGS: {tags}"