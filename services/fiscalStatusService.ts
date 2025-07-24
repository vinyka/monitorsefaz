import { GoogleGenAI, Type } from "@google/genai";
import { SefazStatus, ServiceType, Status } from '../types';

// Assume process.env.API_KEY is configured in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            uf: {
                type: Type.STRING,
                description: 'A sigla do estado (UF) ou da Sefaz Virtual. Exemplos: AC, AL, SVRS, SVAN.',
            },
            autorizador: {
                type: Type.STRING,
                description: 'O nome do autorizador do serviço. Exemplo: Sefaz-AC, Sefaz Virtual RS.',
            },
            status: {
                type: Type.STRING,
                description: `A condição atual do serviço. Deve ser um dos seguintes valores: "${Status.Disponivel}", "${Status.Instavel}", "${Status.Indisponivel}", "${Status.Contingencia}".`,
                enum: Object.values(Status),
            },
        },
        required: ['uf', 'autorizador', 'status'],
    },
};

// --- Lógica de Enriquecimento de Dados (para o modal de detalhes) ---

const generateMockHistory = (currentSefaz: SefazStatus): { status: Status; timestamp: string }[] => {
    const history: { status: Status; timestamp: string }[] = [];
    const now = new Date(currentSefaz.ultimaVerificacao);
    history.push({ status: currentSefaz.status, timestamp: now.toISOString() });

    const allStatuses = Object.values(Status);
    let lastTimestamp = now;

    for (let i = 0; i < 5; i++) {
        const newDate = new Date(lastTimestamp);
        newDate.setMinutes(newDate.getMinutes() - 5 - Math.floor(Math.random() * 10));
        lastTimestamp = newDate;

        // Make history more realistic: more likely to be 'Disponível'
        const randomStatus = Math.random() < 0.8
            ? Status.Disponivel
            : allStatuses[Math.floor(Math.random() * allStatuses.length)];

        history.push({
            status: randomStatus,
            timestamp: lastTimestamp.toISOString()
        });
    }
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const processAndEnrichData = (data: SefazStatus[]): SefazStatus[] => {
    return data.map(sefaz => ({
        ...sefaz,
        history: generateMockHistory(sefaz)
    }));
};

// --- Função Principal Exportada ---

export const fetchStatusData = async (service: ServiceType): Promise<SefazStatus[]> => {
    const prompt = `Por favor, simule o status de disponibilidade para o serviço ${service} em todas as Sefaz (Unidades Federativas e Sefaz Virtuais) do Brasil, em tempo real. A resposta deve ser uma lista em formato JSON.
    
    Contexto: Este é um painel para desenvolvedores e contadores que precisam saber se os serviços de emissão de notas fiscais estão operando.
    
    Requisitos:
    1.  Gere o status para todos os autorizadores relevantes para o serviço ${service}. Isso inclui Sefaz de cada estado e Sefaz Virtuais (SVAN, SVRS, SVC-AN, SVC-RS).
    2.  Use os seguintes status possíveis: "${Status.Disponivel}", "${Status.Instavel}", "${Status.Indisponivel}", "${Status.Contingencia}".
    3.  Simule um cenário realista: a grande maioria dos serviços deve estar '${Status.Disponivel}'. Um ou dois podem estar '${Status.Instavel}'. Status de '${Status.Indisponivel}' ou '${Status.Contingencia}' devem ser raros, mas possíveis, para dar realismo à simulação.
    4.  A resposta DEVE ser apenas o JSON, de acordo com o schema fornecido.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });
        
        const jsonText = response.text.trim();
        // Type assertion for the parsed data from Gemini
        const simulatedData = JSON.parse(jsonText) as Omit<SefazStatus, 'ultimaVerificacao' | 'history'>[];

        const now = new Date().toISOString();
        const rawData: SefazStatus[] = simulatedData.map(item => ({
            ...item,
            // Fallback for status to ensure it's a valid enum value
            status: Object.values(Status).includes(item.status) ? item.status : Status.Indisponivel,
            ultimaVerificacao: now,
        }));
        
        return processAndEnrichData(rawData);

    } catch (error) {
        console.error(`Erro ao gerar dados com a API Gemini para ${service}:`, error);
        if (error instanceof Error) {
            throw new Error(`Falha ao comunicar com a IA para gerar dados de ${service}. Verifique a chave da API e a conexão. Detalhe: ${error.message}`);
        }
        throw new Error(`Ocorreu um erro desconhecido ao gerar dados de ${service}.`);
    }
};
