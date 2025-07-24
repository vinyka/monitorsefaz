
export enum ServiceType {
    NFe = 'NFe',
    NFCe = 'NFC-e',
    CTe = 'CTe',
}

export enum Status {
    Disponivel = 'Disponível',
    Instavel = 'Instável',
    Indisponivel = 'Indisponível',
    Contingencia = 'Em Contingência'
}

export interface SefazStatus {
    uf: string;
    autorizador: string;
    status: Status;
    ultimaVerificacao: string;
    history?: {
        status: Status;
        timestamp: string;
    }[];
}