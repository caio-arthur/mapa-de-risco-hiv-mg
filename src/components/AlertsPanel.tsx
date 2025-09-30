import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Clock, MapPin, ExternalLink } from 'lucide-react';

interface AlertData {
  id: string;
  municipality: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'high_incidence' | 'rapid_growth' | 'outbreak' | 'resource_shortage';
  message: string;
  timestamp: string;
  actionRequired: boolean;
}


interface AlertsPanelProps {
  alerts: AlertData[];
  loading: boolean;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts = [], loading }) => {
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando alertas...</p>
      </div>
    );
  }

  const getAlertIcon = (type: AlertData['type']) => {
    switch (type) {
      case 'high_incidence':
        return <AlertTriangle className="h-4 w-4" />;
      case 'rapid_growth':
        return <TrendingUp className="h-4 w-4" />;
      case 'outbreak':
        return <AlertTriangle className="h-4 w-4" />;
      case 'resource_shortage':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: AlertData['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-risk-critical text-risk-critical-foreground';
      case 'high':
        return 'bg-risk-high text-risk-high-foreground';
      case 'medium':
        return 'bg-risk-medium text-risk-medium-foreground';
      default:
        return 'bg-risk-low text-risk-low-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Sistema de Alertas</h2>
          <p className="text-muted-foreground">
            Monitoramento automatizado de situações críticas
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive" className="bg-risk-critical">
            {criticalAlerts.length} Críticos
          </Badge>
          <Badge variant="secondary" className="bg-risk-high text-risk-high-foreground">
            {highAlerts.length} Altos
          </Badge>
        </div>
      </div>

      {criticalAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-risk-critical flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas Críticos - Ação Imediata
          </h3>
          {criticalAlerts.map((alert) => (
            <Card key={alert.id} className="p-4 border-l-4 border-l-risk-critical bg-risk-critical/5 shadow-card-soft">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <span className="font-semibold">{alert.municipality}</span>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity === 'critical' ? 'CRÍTICO' : 'ALTO'}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mb-3">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(alert.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Município afetado
                    </span>
                  </div>
                </div>
                {alert.actionRequired && (
                  <Button size="sm" className="bg-risk-critical hover:bg-risk-critical/90 text-risk-critical-foreground">
                    Ação Necessária
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-risk-high flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Alertas de Alto Risco
        </h3>
        {highAlerts.map((alert) => (
          <Card key={alert.id} className="p-4 border-l-4 border-l-risk-high bg-risk-high/5 shadow-card-soft">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <span className="font-semibold">{alert.municipality}</span>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    ALTO
                  </Badge>
                </div>
                <p className="text-sm text-foreground mb-3">{alert.message}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(alert.timestamp)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Monitoramento recomendado
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Monitorar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-card shadow-card-soft">
        <h3 className="text-lg font-semibold mb-4">Configurações de Alertas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Limites de Alerta</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Alto Risco: &gt; 80 casos/100k hab</li>
              <li>• Crítico: &gt; 120 casos/100k hab</li>
              <li>• Pico sazonal: +20% em 30 dias</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ações Automáticas</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Notificação autoridades de saúde</li>
              <li>• Relatório epidemiológico</li>
              <li>• Ativação de protocolos de emergência</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AlertsPanel;