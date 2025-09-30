export interface HivRecord {
  data_notificacao: string;
  ano: number;
  id_municipio: string;
  data_diagnostico: string;
  data_nascimento: string;
  idade: number;
  sexo: string;
  gestante: string;
  raca_cor: string;
  escolaridade: string;
  id_municipio_residencia: string;
  antecedente_transmissao_vertical: string;
  forma_transmissao: string;
  antecedente_usuario_drogas: string;
  laboratorio_triagem: string;
  antecedente_tuberculose: string;
  antecedente_candidiase: string;
  antecedente_doenca_pulmonar: string;
  antecedente_herpes: string;
  ant_disfun: string;
  antecedente_diarreia: string;
  antecedente_febre_amarela: string;
  antecedente_caquexia: string;
  antecedente_asterixis: string;
  ant_dermat: string;
  antecedente_anemia: string;
  antecedente_tosse: string;
  antecedente_linfoma: string;
  antecedente_esofagite: string;
  antecedente_pneumonia: string;
  antecedente_toxoplasmose: string;
  antecedente_contagiosa: string;
  def_diagno: string;
  evolucao: string;
  criterio_diagnostico: number;
  sexualidade: string;
}

export function parseCSV(csvText: string): HivRecord[] {
  const lines = csvText.trim().split('\n');
  const records: HivRecord[] = [];

  for (const line of lines) {
    const values = line.split(';');
    
    if (values.length < 36) continue;

    const record: HivRecord = {
      data_notificacao: values[0],
      ano: parseInt(values[1]),
      id_municipio: values[2],
      data_diagnostico: values[3],
      data_nascimento: values[4],
      idade: parseFloat(values[5].replace(',', '.')),
      sexo: values[6],
      gestante: values[7],
      raca_cor: values[8],
      escolaridade: values[9],
      id_municipio_residencia: values[10],
      antecedente_transmissao_vertical: values[11],
      forma_transmissao: values[12],
      antecedente_usuario_drogas: values[13],
      laboratorio_triagem: values[14],
      antecedente_tuberculose: values[15],
      antecedente_candidiase: values[16],
      antecedente_doenca_pulmonar: values[17],
      antecedente_herpes: values[18],
      ant_disfun: values[19],
      antecedente_diarreia: values[20],
      antecedente_febre_amarela: values[21],
      antecedente_caquexia: values[22],
      antecedente_asterixis: values[23],
      ant_dermat: values[24],
      antecedente_anemia: values[25],
      antecedente_tosse: values[26],
      antecedente_linfoma: values[27],
      antecedente_esofagite: values[28],
      antecedente_pneumonia: values[29],
      antecedente_toxoplasmose: values[30],
      antecedente_contagiosa: values[31],
      def_diagno: values[32],
      evolucao: values[33],
      criterio_diagnostico: parseFloat(values[34].replace(',', '.')),
      sexualidade: values[35],
    };

    records.push(record);
  }

  return records;
}
