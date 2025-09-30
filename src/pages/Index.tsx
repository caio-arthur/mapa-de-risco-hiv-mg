import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import HivMapView from '@/components/HivMapView';
import StatisticsPanel from '@/components/StatisticsPanel';
import AlertsPanel from '@/components/AlertsPanel';
import RiskLegend from '@/components/RiskLegend';
import { MapPin, BarChart3, AlertTriangle, Activity } from 'lucide-react';
import { useHivData } from '@/hooks/useHivData';

const Index = () => {
  const [activeTab, setActiveTab] = useState('map');
  const { municipalities, statistics, alerts, loading, error } = useHivData();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <p className="text-destructive font-semibold mb-2">Erro ao carregar dados</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm shadow-card-soft border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-health">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Sistema de Monitoramento HIV/AIDS</h1>
                <p className="text-sm text-muted-foreground">Minas Gerais - Vigilância Epidemiológica</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Última atualização</p>
              <p className="text-xs text-muted-foreground">15 de Janeiro de 2024</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Mapa de Risco
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="p-6 bg-gradient-card shadow-card-soft">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Mapa Interativo - Distribuição Geográfica</h2>
                    <p className="text-sm text-muted-foreground">
                      Clique nos marcadores para visualizar detalhes dos municípios
                    </p>
                  </div>
                  <HivMapView municipalities={municipalities} loading={loading} />
                </Card>
              </div>
              
              <div className="space-y-4">
                <RiskLegend />
                
                <Card className="p-4 bg-gradient-card shadow-card-soft">
                  <h3 className="font-semibold mb-3">Resumo Rápido</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total de Casos:</span>
                      <span className="font-medium">{loading ? '...' : statistics?.totalCases.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Municípios:</span>
                      <span className="font-medium">{loading ? '...' : municipalities.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Taxa Geral:</span>
                      <span className="font-medium">
                        {loading ? '...' : ((statistics?.totalCases / municipalities.reduce((sum, m) => sum + m.population, 0)) * 100000).toFixed(1) + '/100k'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Alertas Ativos:</span>
                      <span className="font-medium text-risk-critical">{loading ? '...' : alerts.length}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <StatisticsPanel municipalities={municipalities} statistics={statistics} loading={loading} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel alerts={alerts} loading={loading} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Sistema de Vigilância Epidemiológica - Secretaria de Saúde de Minas Gerais
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Dados: SUS/DATASUS</span>
              <span>•</span>
              <span>Atualização: Semanal</span>
              <span>•</span>
              <span>Versão: 1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
