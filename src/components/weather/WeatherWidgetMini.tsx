'use client';

import { useState } from 'react';
import WeatherForecastWidget from './WeatherForecastWidget';

export default function WeatherWidgetMini() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed top-24 right-8 z-40 hidden lg:block">
      <WeatherForecastWidget
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      />
    </div>
  );
}

