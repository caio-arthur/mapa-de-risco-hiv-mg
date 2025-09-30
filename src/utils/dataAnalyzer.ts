import { HivRecord } from './csvParser';

export interface MunicipalityData {
  id: string;
  name: string;
  coordinates: [number, number];
  hivCases: number;
  population: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  incidenceRate: number;
  deaths: number;
  ageDistribution: { [key: string]: number };
  sexDistribution: { masculino: number; feminino: number };
  sexualityDistribution: { [key: string]: number };
  transmissionForms: { [key: string]: number };
  recentCases: number; // casos nos últimos 3 meses
}

// Coordenadas aproximadas dos principais municípios de MG
const municipalityCoordinates: { [key: string]: [number, number] } = {
  'Belo Horizonte': [-43.9378, -19.9167],
  'Uberlândia': [-48.2772, -18.9186],
  'Contagem': [-44.0536, -19.9320],
  'Juiz de Fora': [-43.3503, -21.7642],
  'Betim': [-44.1983, -19.9678],
  'Montes Claros': [-43.8612, -16.7351],
  'Ribeirão das Neves': [-44.0867, -19.7667],
  'Uberaba': [-47.9317, -19.7475],
  'Governador Valadares': [-41.9495, -18.8511],
  'Ipatinga': [-42.5369, -19.4683],
  'Santa Luzia': [-43.8511, -19.7697],
  'Vespasiano': [-43.9233, -19.6919],
  'Muriaé': [-42.3664, -21.1306],
  'São Geraldo': [-42.8572, -20.9214],
  'Santos Dumont': [-43.5519, -21.4556],
  'Várzea da Palma': [-44.7289, -17.5967],
  'Leopoldina': [-42.6428, -21.5314],
  'Viçosa': [-42.8819, -20.7539],
  'Ponte Nova': [-42.9086, -20.4156],
  'Itajubá': [-45.4528, -22.4256],
  'Pouso Alegre': [-45.9361, -22.2300],
  'Extrema': [-46.3178, -22.8553],
  'Guaxupé': [-46.7122, -21.3064],
  'Ituiutaba': [-49.4647, -18.9686],
  'Patrocínio': [-46.9931, -18.9436],
  'Ouro Branco': [-43.6914, -20.5233],
  'Conselheiro Lafaiete': [-43.7861, -20.6606],
  'Sericita': [-42.8667, -20.1167],
  'Espírito Santo do Dourado': [-45.9347, -22.0458],
  'Prata': [-48.9281, -19.3086],
  'Catas Altas da Noruega': [-43.4981, -20.7281],
  'Congonhas': [-43.8603, -20.4978],
};

// População estimada dos municípios (dados aproximados para cálculo da taxa de incidência)
const municipalityPopulation: { [key: string]: number } = {
  'Belo Horizonte': 2530701,
  'Uberlândia': 699097,
  'Contagem': 668949,
  'Juiz de Fora': 573285,
  'Betim': 439340,
  'Montes Claros': 413487,
  'Ribeirão das Neves': 334858,
  'Uberaba': 337092,
  'Governador Valadares': 281046,
  'Ipatinga': 263410,
  'Santa Luzia': 220444,
  'Vespasiano': 129786,
  'Muriaé': 108157,
  'São Geraldo': 9247,
  'Santos Dumont': 47827,
  'Várzea da Palma': 38265,
  'Leopoldina': 52869,
  'Viçosa': 78846,
  'Ponte Nova': 59742,
  'Itajubá': 96655,
  'Pouso Alegre': 152549,
  'Extrema': 35815,
  'Guaxupé': 51167,
  'Ituiutaba': 104671,
  'Patrocínio': 90757,
  'Ouro Branco': 38717,
  'Conselheiro Lafaiete': 128586,
  'Sericita': 1500,
  'Espírito Santo do Dourado': 4598,
  'Prata': 28383,
  'Catas Altas da Noruega': 3764,
  'Congonhas': 54489,
};

export function analyzeMunicipalityData(records: HivRecord[]): MunicipalityData[] {
  const municipalityMap = new Map<string, HivRecord[]>();

  // Agrupar registros por município
  records.forEach(record => {
    const municipality = record.id_municipio;
    if (!municipalityMap.has(municipality)) {
      municipalityMap.set(municipality, []);
    }
    municipalityMap.get(municipality)!.push(record);
  });

  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));

  // Processar cada município
  const municipalitiesData: MunicipalityData[] = [];

  municipalityMap.forEach((municipalityRecords, municipalityName) => {
    const hivCases = municipalityRecords.length;
    const population = municipalityPopulation[municipalityName] || 50000;
    const incidenceRate = (hivCases / population) * 100000;

    // Calcular mortes
    const deaths = municipalityRecords.filter(r => r.evolucao === 'Óbito por Aids').length;

    // Distribuição por idade
    const ageDistribution: { [key: string]: number } = {};
    municipalityRecords.forEach(record => {
      const age = Math.floor(record.idade);
      let ageGroup = '';
      if (age < 20) ageGroup = '0-19';
      else if (age < 30) ageGroup = '20-29';
      else if (age < 40) ageGroup = '30-39';
      else if (age < 50) ageGroup = '40-49';
      else if (age < 60) ageGroup = '50-59';
      else ageGroup = '60+';
      
      ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;
    });

    // Distribuição por sexo
    const sexDistribution = {
      masculino: municipalityRecords.filter(r => r.sexo === 'Masculino').length,
      feminino: municipalityRecords.filter(r => r.sexo === 'Feminino').length,
    };

    // Distribuição por sexualidade
    const sexualityDistribution: { [key: string]: number } = {};
    municipalityRecords.forEach(record => {
      const sexuality = record.sexualidade || 'Não informado';
      sexualityDistribution[sexuality] = (sexualityDistribution[sexuality] || 0) + 1;
    });

    // Formas de transmissão
    const transmissionForms: { [key: string]: number } = {};
    municipalityRecords.forEach(record => {
      const transmission = record.forma_transmissao || 'Não informado';
      transmissionForms[transmission] = (transmissionForms[transmission] || 0) + 1;
    });

    // Casos recentes (últimos 3 meses)
    const recentCases = municipalityRecords.filter(record => {
      const notificationDate = new Date(record.data_notificacao);
      return notificationDate >= threeMonthsAgo;
    }).length;

    // Determinar nível de risco baseado na taxa de incidência
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (incidenceRate < 50) riskLevel = 'low';
    else if (incidenceRate < 100) riskLevel = 'medium';
    else if (incidenceRate < 150) riskLevel = 'high';
    else riskLevel = 'critical';

    const coordinates = municipalityCoordinates[municipalityName] || [-44.0, -19.5];

    municipalitiesData.push({
      id: municipalityName.toLowerCase().replace(/\s+/g, '-'),
      name: municipalityName,
      coordinates,
      hivCases,
      population,
      riskLevel,
      incidenceRate: parseFloat(incidenceRate.toFixed(2)),
      deaths,
      ageDistribution,
      sexDistribution,
      sexualityDistribution,
      transmissionForms,
      recentCases,
    });
  });

  return municipalitiesData.sort((a, b) => b.hivCases - a.hivCases);
}

export function generateStatistics(records: HivRecord[]) {
  const totalCases = records.length;
  const deaths = records.filter(r => r.evolucao === 'Óbito por Aids').length;
  const alive = records.filter(r => r.evolucao === 'Vivo').length;

  // Distribuição por ano
  const yearDistribution: { [key: number]: number } = {};
  records.forEach(record => {
    yearDistribution[record.ano] = (yearDistribution[record.ano] || 0) + 1;
  });

  // Distribuição por sexo
  const sexDistribution = {
    masculino: records.filter(r => r.sexo === 'Masculino').length,
    feminino: records.filter(r => r.sexo === 'Feminino').length,
  };

  // Distribuição por faixa etária
  const ageGroups: { [key: string]: number } = {};
  records.forEach(record => {
    const age = Math.floor(record.idade);
    let ageGroup = '';
    if (age < 20) ageGroup = '0-19';
    else if (age < 30) ageGroup = '20-29';
    else if (age < 40) ageGroup = '30-39';
    else if (age < 50) ageGroup = '40-49';
    else if (age < 60) ageGroup = '50-59';
    else ageGroup = '60+';
    
    ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
  });

  // Distribuição por sexualidade
  const sexualityDistribution: { [key: string]: number } = {};
  records.forEach(record => {
    const sexuality = record.sexualidade || 'Não informado';
    sexualityDistribution[sexuality] = (sexualityDistribution[sexuality] || 0) + 1;
  });

  return {
    totalCases,
    deaths,
    alive,
    mortalityRate: ((deaths / totalCases) * 100).toFixed(2),
    yearDistribution,
    sexDistribution,
    ageGroups,
    sexualityDistribution,
  };
}

export function generateAlerts(municipalitiesData: MunicipalityData[]) {
  const alerts = [];

  municipalitiesData.forEach(municipality => {
    // Alerta crítico: alta taxa de incidência
    if (municipality.incidenceRate > 150) {
      alerts.push({
        id: `critical-${municipality.id}`,
        municipality: municipality.name,
        severity: 'critical' as const,
        type: 'high_incidence' as const,
        message: `Taxa de incidência extremamente alta: ${municipality.incidenceRate.toFixed(1)}/100k habitantes`,
        timestamp: new Date().toISOString(),
        actionRequired: true,
      });
    }

    // Alerta: crescimento recente
    const growthRate = (municipality.recentCases / municipality.hivCases) * 100;
    if (growthRate > 30 && municipality.recentCases > 5) {
      alerts.push({
        id: `growth-${municipality.id}`,
        municipality: municipality.name,
        severity: 'high' as const,
        type: 'rapid_growth' as const,
        message: `${municipality.recentCases} novos casos nos últimos 3 meses (${growthRate.toFixed(0)}% do total)`,
        timestamp: new Date().toISOString(),
        actionRequired: true,
      });
    }

    // Alerta: mortalidade elevada
    if (municipality.deaths > 3) {
      alerts.push({
        id: `deaths-${municipality.id}`,
        municipality: municipality.name,
        severity: 'high' as const,
        type: 'outbreak' as const,
        message: `${municipality.deaths} óbitos por AIDS registrados`,
        timestamp: new Date().toISOString(),
        actionRequired: true,
      });
    }
  });

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
