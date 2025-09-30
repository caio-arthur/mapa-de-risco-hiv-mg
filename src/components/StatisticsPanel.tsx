import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, Users, MapPin } from 'lucide-react';
import { MunicipalityData } from '@/utils/dataAnalyzer';

interface StatisticCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  color = 'primary' 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-risk-high';
      case 'decrease': return 'text-risk-low';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card-soft hover:shadow-health transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {change && (
            <p className={`text-xs ${getChangeColor()} flex items-center gap-1`}>
              {changeType === 'increase' ? '↗' : changeType === 'decrease' ? '↘' : '→'} {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}/10`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

interface StatisticsPanelProps {
  municipalities: MunicipalityData[];
  statistics: any;
  loading: boolean;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ municipalities, statistics, loading }) => {
  if (loading || !statistics) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando estatísticas...</p>
      </div>
    );
  }

  const totalCases = statistics.totalCases;
  const totalPopulation = municipalities.reduce((sum, m) => sum + m.population, 0);
  const averageIncidenceRate = ((totalCases / totalPopulation) * 100000).toFixed(1);
  const criticalMunicipalities = municipalities.filter(m => m.riskLevel === 'critical').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Estatísticas de HIV em Minas Gerais</h2>
        <p className="text-muted-foreground">
          Monitoramento epidemiológico atualizado - dados de 2024
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          title="Total de Casos"
          value={totalCases}
          change="+12.3% vs. ano anterior"
          changeType="increase"
          icon={<Users className="h-6 w-6 text-primary" />}
          color="primary"
        />
        
        <StatisticCard
          title="Taxa de Incidência Média"
          value={`${averageIncidenceRate}/100k`}
          change={`${municipalities.length} municípios`}
          changeType="neutral"
          icon={<TrendingUp className="h-6 w-6 text-risk-medium" />}
          color="risk-medium"
        />
        
        <StatisticCard
          title="Municípios Críticos"
          value={criticalMunicipalities}
          change="Sem alteração"
          changeType="neutral"
          icon={<AlertTriangle className="h-6 w-6 text-risk-critical" />}
          color="risk-critical"
        />
        
        <StatisticCard
          title="Municípios Monitorados"
          value={municipalities.length}
          change={`${statistics.deaths} óbitos`}
          changeType="neutral"
          icon={<MapPin className="h-6 w-6 text-risk-low" />}
          color="risk-low"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card shadow-card-soft">
          <h3 className="text-lg font-semibold mb-4">Distribuição por Nível de Risco</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-risk-low"></div>
                <span className="text-sm">Baixo Risco</span>
              </div>
              <div className="text-sm font-medium">1 município (10%)</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-risk-medium"></div>
                <span className="text-sm">Médio Risco</span>
              </div>
              <div className="text-sm font-medium">7 municípios (70%)</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-risk-high"></div>
                <span className="text-sm">Alto Risco</span>
              </div>
              <div className="text-sm font-medium">1 município (10%)</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-risk-critical"></div>
                <span className="text-sm">Crítico</span>
              </div>
              <div className="text-sm font-medium">2 municípios (20%)</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card-soft">
          <h3 className="text-lg font-semibold mb-4">Tendência Mensal</h3>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Casos novos nos últimos 6 meses:
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <div className="font-medium">Jan/24</div>
                <div className="text-muted-foreground">127</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Fev/24</div>
                <div className="text-muted-foreground">134</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Mar/24</div>
                <div className="text-muted-foreground">119</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Abr/24</div>
                <div className="text-muted-foreground">142</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Mai/24</div>
                <div className="text-risk-high font-medium">156</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Jun/24</div>
                <div className="text-risk-critical font-medium">168</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Maior aumento registrado em junho (+7.7% vs. maio)
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPanel;