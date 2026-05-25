export interface Selecao {
  codigo: string;
  nome: string;
  grupo: string;
}

export const SELECOES: Selecao[] = [
  { codigo: 'MEX', nome: 'México', grupo: 'A' },
  { codigo: 'RSA', nome: 'África do Sul', grupo: 'A' },
  { codigo: 'KOR', nome: 'Coreia do Sul', grupo: 'A' },
  { codigo: 'CZE', nome: 'Rep. Tcheca', grupo: 'A' },
  { codigo: 'CAN', nome: 'Canadá', grupo: 'B' },
  { codigo: 'BIH', nome: 'Bósnia', grupo: 'B' },
  { codigo: 'QAT', nome: 'Catar', grupo: 'B' },
  { codigo: 'SUI', nome: 'Suíça', grupo: 'B' },
  { codigo: 'BRA', nome: 'Brasil', grupo: 'C' },
  { codigo: 'MAR', nome: 'Marrocos', grupo: 'C' },
  { codigo: 'HAI', nome: 'Haiti', grupo: 'C' },
  { codigo: 'SCO', nome: 'Escócia', grupo: 'C' },
  { codigo: 'USA', nome: 'EUA', grupo: 'D' },
  { codigo: 'PAR', nome: 'Paraguai', grupo: 'D' },
  { codigo: 'AUS', nome: 'Austrália', grupo: 'D' },
  { codigo: 'TUR', nome: 'Turquia', grupo: 'D' },
  { codigo: 'GER', nome: 'Alemanha', grupo: 'E' },
  { codigo: 'CUW', nome: 'Curaçao', grupo: 'E' },
  { codigo: 'CIV', nome: 'C. do Marfim', grupo: 'E' },
  { codigo: 'ECU', nome: 'Equador', grupo: 'E' },
  { codigo: 'NED', nome: 'Holanda', grupo: 'F' },
  { codigo: 'JPN', nome: 'Japão', grupo: 'F' },
  { codigo: 'SWE', nome: 'Suécia', grupo: 'F' },
  { codigo: 'TUN', nome: 'Tunísia', grupo: 'F' },
  { codigo: 'BEL', nome: 'Bélgica', grupo: 'G' },
  { codigo: 'EGY', nome: 'Egito', grupo: 'G' },
  { codigo: 'IRN', nome: 'Irã', grupo: 'G' },
  { codigo: 'NZL', nome: 'Nova Zelândia', grupo: 'G' },
  { codigo: 'ESP', nome: 'Espanha', grupo: 'H' },
  { codigo: 'CPV', nome: 'Cabo Verde', grupo: 'H' },
  { codigo: 'KSA', nome: 'Arábia Saudita', grupo: 'H' },
  { codigo: 'URU', nome: 'Uruguai', grupo: 'H' },
  { codigo: 'FRA', nome: 'França', grupo: 'I' },
  { codigo: 'SEN', nome: 'Senegal', grupo: 'I' },
  { codigo: 'IRQ', nome: 'Iraque', grupo: 'I' },
  { codigo: 'NOR', nome: 'Noruega', grupo: 'I' },
  { codigo: 'ARG', nome: 'Argentina', grupo: 'J' },
  { codigo: 'ALG', nome: 'Argélia', grupo: 'J' },
  { codigo: 'AUT', nome: 'Áustria', grupo: 'J' },
  { codigo: 'JOR', nome: 'Jordânia', grupo: 'J' },
  { codigo: 'POR', nome: 'Portugal', grupo: 'K' },
  { codigo: 'COD', nome: 'RD Congo', grupo: 'K' },
  { codigo: 'UZB', nome: 'Uzbequistão', grupo: 'K' },
  { codigo: 'COL', nome: 'Colômbia', grupo: 'K' },
  { codigo: 'ENG', nome: 'Inglaterra', grupo: 'L' },
  { codigo: 'CRO', nome: 'Croácia', grupo: 'L' },
  { codigo: 'GHA', nome: 'Gana', grupo: 'L' },
  { codigo: 'PAN', nome: 'Panamá', grupo: 'L' },
];

export const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const FIGURINHAS_POR_SELECAO = 20;

export interface SecaoEspecial {
  codigo: string;
  nome: string;
  numeros: string[];
}

export const ESPECIAIS: SecaoEspecial[] = [
  {
    codigo: 'FWC',
    nome: 'Hist. das Copas',
    numeros: ['00', '1', '2', '3', '4', '5', '6', '7', '8', '9',
              '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
  },
];
