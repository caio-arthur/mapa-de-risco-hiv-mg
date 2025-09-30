import { useState, useEffect } from 'react';
import { parseCSV, HivRecord } from '@/utils/csvParser';
import { analyzeMunicipalityData, generateStatistics, generateAlerts, MunicipalityData } from '@/utils/dataAnalyzer';

export function useHivData() {
  const [records, setRecords] = useState<HivRecord[]>([]);
  const [municipalities, setMunicipalities] = useState<MunicipalityData[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/data/hiv_dataset.csv');
        const csvText = await response.text();
        
        const parsedRecords = parseCSV(csvText);
        setRecords(parsedRecords);

        const municipalitiesData = analyzeMunicipalityData(parsedRecords);
        setMunicipalities(municipalitiesData);

        const stats = generateStatistics(parsedRecords);
        setStatistics(stats);

        const generatedAlerts = generateAlerts(municipalitiesData);
        setAlerts(generatedAlerts);

        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do sistema');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { records, municipalities, statistics, alerts, loading, error };
}
