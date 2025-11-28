/**
 * Utilitários para manipulação de arquivos CSV
 * Seguindo princípios SOLID - Single Responsibility
 */

export interface CsvParseOptions {
  skipHeader?: boolean;
  delimiter?: string;
  trim?: boolean;
}

/**
 * Faz o parsing de um arquivo CSV
 */
export async function parseCsvFile<T>(
  file: File,
  mapper: (row: string[]) => T,
  options: CsvParseOptions = {}
): Promise<T[]> {
  const { skipHeader = true, delimiter = ',', trim = true } = options;

  const text = await file.text();
  const lines = text.split('\n').filter((line) => line.trim());

  const startIndex = skipHeader ? 1 : 0;
  
  return lines.slice(startIndex).map((line) => {
    const values = line.split(delimiter);
    const processedValues = trim ? values.map((v) => v.trim()) : values;
    return mapper(processedValues);
  });
}

/**
 * Gera e faz o download de um arquivo CSV
 */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Gera template CSV de funcionários
 */
export function generateEmployeeCsvTemplate(): string {
  const header = 'name,email,sector,position';
  const example1 = 'João Silva,joao@empresa.com,TI,Desenvolvedor';
  const example2 = 'Maria Santos,maria@empresa.com,RH,Analista';
  
  return [header, example1, example2].join('\n');
}

/**
 * Converte array de objetos em CSV
 */
export function objectsToCsv<T extends Record<string, any>>(
  data: T[],
  headers: (keyof T)[]
): string {
  const headerRow = headers.join(',');
  const dataRows = data.map((item) =>
    headers.map((header) => item[header] ?? '').join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
}
