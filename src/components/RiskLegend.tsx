import React from 'react';
import { Card } from '@/components/ui/card';

const RiskLegend = () => {
  const riskLevels = [
    {
      level: 'Baixo Risco',
      color: 'bg-risk-low',
      range: '< 60 casos/100k hab',
      description: 'Situação controlada'
    },
    {
      level: 'Médio Risco',
      color: 'bg-risk-medium',
      range: '60-80 casos/100k hab',
      description: 'Monitoramento contínuo'
    },
    {
      level: 'Alto Risco',
      color: 'bg-risk-high',
      range: '80-120 casos/100k hab',
      description: 'Atenção redobrada'
    },
    {
      level: 'Crítico',
      color: 'bg-risk-critical',
      range: '> 120 casos/100k hab',
      description: 'Intervenção imediata'
    }
  ];

  return (
    <Card className="p-4 bg-gradient-card shadow-card-soft">
      <h3 className="text-lg font-semibold mb-4">Legenda de Risco</h3>
      <div className="space-y-3">
        {riskLevels.map((risk, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${risk.color}`}></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{risk.level}</span>
                <span className="text-xs text-muted-foreground">{risk.range}</span>
              </div>
              <p className="text-xs text-muted-foreground">{risk.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          * Tamanho dos marcadores proporcionais ao número total de casos
        </p>
      </div>
    </Card>
  );
};

export default RiskLegend;