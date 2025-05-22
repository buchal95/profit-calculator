const { useState, useEffect } = React;

const ProfitCalculator = () => {
  // State pro vstupní hodnoty
  const [capital, setCapital] = useState(10000);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [yearlyProfit, setYearlyProfit] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [betCount, setBetCount] = useState(0);
  const [avgCoefficient, setAvgCoefficient] = useState(0);
  const [loading, setLoading] = useState(false);

  // Parametry pro výpočet podle rizika
  const riskParameters = {
    low: {
      winRate: { min: 65, max: 70 },
      avgOdd: { min: 1.3, max: 1.5 },
      betsPerMonth: { min: 45, max: 60 },
      stakePercent: { min: 1, max: 3 }
    },
    medium: {
      winRate: { min: 55, max: 60 },
      avgOdd: { min: 1.8, max: 2.2 },
      betsPerMonth: { min: 30, max: 45 },
      stakePercent: { min: 3, max: 5 }
    },
    high: {
      winRate: { min: 40, max: 45 },
      avgOdd: { min: 2.5, max: 3.5 },
      betsPerMonth: { min: 20, max: 30 },
      stakePercent: { min: 5, max: 7 }
    }
  };

  // Funkce pro výpočet náhodné hodnoty v rozmezí
  const getRandomInRange = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // Funkce pro výpočet zisku
  const calculateProfit = () => {
    const params = riskParameters[riskLevel];
    
    // Získání náhodných hodnot v definovaných rozmezích
    const winRate = getRandomInRange(params.winRate.min, params.winRate.max) / 100;
    const avgOdd = getRandomInRange(params.avgOdd.min, params.avgOdd.max);
    const betsPerMonth = Math.floor(getRandomInRange(params.betsPerMonth.min, params.betsPerMonth.max));
    const stakePercent = getRandomInRange(params.stakePercent.min, params.stakePercent.max) / 100;
    
    // Výpočet měsíčního zisku
    const monthlyReturn = capital * (1 + ((winRate * (avgOdd - 1) - (1 - winRate)) * stakePercent * betsPerMonth));
    const monthlyProfit = monthlyReturn - capital;
    
    // 12 měsíců složený úrok (reinvestování)
    const compoundedYearlyProfit = capital * Math.pow(1 + (monthlyProfit / capital), 12) - capital;
    
    // Aktualizace stavů
    setMonthlyProfit(Math.round(monthlyProfit));
    setYearlyProfit(Math.round(compoundedYearlyProfit));
    setSuccessRate(Math.round(winRate * 100));
    setBetCount(betsPerMonth);
    setAvgCoefficient(avgOdd.toFixed(2));
  };

  // Validace emailu
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidEmail(emailRegex.test(email));
  }, [email]);

  // Handler pro výpočet
  const handleCalculate = () => {
    if (capital < 1000) {
      alert('Minimální startovací kapitál je 1 000 Kč');
      return;
    }
    
    setLoading(true);
    calculateProfit();
    
    // Simulace načítání pro lepší UX
    setTimeout(() => {
      setLoading(false);
      setShowEmailForm(true);
    }, 800);
  };

  // Handler pro submit emailu
  const handleEmailSubmit = () => {
    if (validEmail) {
      setShowEmailForm(false);
      setShowResults(true);
    }
  };

  // Mapování rizikových úrovní na textový popis
  const riskTexts = {
    low: 'Nízká',
    medium: 'Střední',
    high: 'Vysoká'
  };

  // Funkce pro formátování částky v Kč
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(amount);
  };

  return React.createElement('div', { className: "max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden m-4" },
    // Header
    React.createElement('div', { className: "bg-blue-900 text-white p-6 flex items-center justify-between" },
      React.createElement('div', { className: "flex items-center" },
        React.createElement('span', { className: "mr-3 text-2xl" }, '🧮'),
        React.createElement('h2', { className: "text-2xl font-bold" }, 'Kalkulačka potenciálního výdělku')
      ),
      React.createElement('div', { className: "text-sm bg-yellow-500 py-1 px-3 rounded-full font-medium" }, 'Exkluzivní nástroj')
    ),

    // Main content
    React.createElement('div', { className: "p-6" },
      !showEmailForm && !showResults ? 
        // Input form
        React.createElement('div', null,
          React.createElement('div', { className: "mb-8" },
            React.createElement('p', { className: "text-gray-700 text-lg mb-4" },
              'Vypočítejte si svůj potenciální výdělek ze sportovních predikcí podle našeho 7krokového systému. Stačí zadat startovací kapitál a zvolit míru rizika.'
            ),
            React.createElement('div', { className: "flex items-center text-gray-600 mb-1" },
              React.createElement('span', { className: "text-green-500 mr-2" }, '✓'),
              React.createElement('p', null, 'Založeno na datech tisíců úspěšných sázek')
            ),
            React.createElement('div', { className: "flex items-center text-gray-600" },
              React.createElement('span', { className: "text-green-500 mr-2" }, '✓'),
              React.createElement('p', null, 'Zahrnuje všech 7 kroků našeho exkluzivního systému')
            )
          ),
          
          React.createElement('div', { className: "mb-6" },
            React.createElement('label', { className: "block text-gray-700 font-semibold mb-2" },
              'Váš startovací kapitál (Kč)'
            ),
            React.createElement('div', { className: "relative" },
              React.createElement('input', {
                type: "number",
                min: "1000", 
                value: capital,
                onChange: (e) => setCapital(Number(e.target.value)),
                className: "w-full p-3 border-2 border-gray-300 rounded-lg font-medium text-lg"
              }),
              React.createElement('div', { className: "absolute right-3 top-3 text-gray-500" }, 'Kč')
            ),
            React.createElement('p', { className: "text-sm text-gray-500 mt-1" },
              'Doporučený minimální kapitál: 5 000 Kč'
            )
          ),
          
          React.createElement('div', { className: "mb-8" },
            React.createElement('label', { className: "block text-gray-700 font-semibold mb-3" },
              'Míra rizika'
            ),
            React.createElement('div', { className: "grid grid-cols-3 gap-3" },
              ['low', 'medium', 'high'].map((risk) =>
                React.createElement('button', {
                  key: risk,
                  className: `py-3 px-4 rounded-lg border-2 transition-all ${
                    riskLevel === risk 
                      ? 'border-blue-600 bg-blue-50 text-blue-800' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`,
                  onClick: () => setRiskLevel(risk)
                },
                  React.createElement('span', { className: "font-semibold" }, riskTexts[risk])
                )
              )
            ),
            React.createElement('div', { className: "grid grid-cols-3 gap-3 mt-1" },
              React.createElement('p', { className: "text-xs text-gray-500 text-center" }, 'Bezpečnější volba s menšími, ale stabilními výnosy'),
              React.createElement('p', { className: "text-xs text-gray-500 text-center" }, 'Vyvážená strategie mezi rizikem a výnosem'),
              React.createElement('p', { className: "text-xs text-gray-500 text-center" }, 'Vyšší riziko s potenciálem větších výnosů')
            )
          ),
          
          React.createElement('button', {
            onClick: handleCalculate,
            className: "w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center"
          },
            React.createElement('span', { className: "mr-2" }, '🧮'),
            'Vypočítat můj potenciální výdělek'
          )
        )
      : showEmailForm && !showResults ?
        // Email form
        React.createElement('div', { className: "text-center py-6" },
          loading ? 
            React.createElement('div', { className: "flex flex-col items-center" },
              React.createElement('div', { className: "w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" }),
              React.createElement('p', { className: "text-gray-700 text-lg" }, 'Vypočítáváme váš potenciální výdělek...')
            )
          :
            React.createElement('div', null,
              React.createElement('div', { className: "flex justify-center mb-6" },
                React.createElement('span', { className: "text-blue-600 text-4xl" }, '🔒')
              ),
              React.createElement('h3', { className: "text-2xl font-bold mb-2" }, 'Váš výsledek je připraven!'),
              React.createElement('p', { className: "text-gray-600 mb-6" },
                'Zadejte svůj e-mail pro zobrazení detailní analýzy vašeho potenciálního výdělku'
              ),
              
              React.createElement('div', { className: "max-w-md mx-auto" },
                React.createElement('div', { className: "mb-4 relative" },
                  React.createElement('span', { className: "absolute left-3 top-3.5 text-gray-400" }, '📧'),
                  React.createElement('input', {
                    type: "email",
                    placeholder: "Váš e-mail",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    className: "w-full py-3 pl-10 pr-3 border-2 border-gray-300 rounded-lg"
                  })
                ),
                
                React.createElement('button', {
                  onClick: handleEmailSubmit,
                  disabled: !validEmail,
                  className: `w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center ${
                    validEmail ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  }`
                },
                  'Zobrazit výsledky ',
                  React.createElement('span', { className: "ml-2" }, '→')
                ),
                
                React.createElement('p', { className: "text-xs text-gray-500 mt-3" },
                  'Vážíme si vašeho soukromí. Vaše údaje nikdy neprodáme třetím stranám.'
                )
              ),
              
              React.createElement('div', { className: "mt-8 flex items-center justify-center text-gray-600" },
                React.createElement('span', { className: "text-yellow-500 mr-2" }, '⚠️'),
                React.createElement('p', { className: "text-sm" }, 'Tato nabídka je časově omezená')
              )
            )
        )
      :
        // Results
        React.createElement('div', null,
          React.createElement('div', { className: "mb-8 bg-blue-50 border border-blue-200 rounded-lg p-5" },
            React.createElement('h3', { className: "text-xl font-bold text-blue-800 mb-3" }, 'Váš potenciální výdělek'),
            
            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-4" },
              React.createElement('div', { className: "bg-white rounded-lg p-4 shadow-sm" },
                React.createElement('p', { className: "text-gray-500 text-sm" }, 'Odhadovaný měsíční zisk'),
                React.createElement('div', { className: "flex items-center" },
                  React.createElement('span', { className: "text-green-500 mr-2 text-xl" }, '📈'),
                  React.createElement('p', { className: "text-3xl font-bold text-gray-800" }, formatCurrency(monthlyProfit))
                )
              ),
              
              React.createElement('div', { className: "bg-white rounded-lg p-4 shadow-sm" },
                React.createElement('p', { className: "text-gray-500 text-sm" }, 'Odhadovaný roční zisk'),
                React.createElement('div', { className: "flex items-center" },
                  React.createElement('span', { className: "text-green-500 mr-2 text-xl" }, '📊'),
                  React.createElement('p', { className: "text-3xl font-bold text-gray-800" }, formatCurrency(yearlyProfit))
                )
              )
            ),
            
            React.createElement('div', { className: "grid grid-cols-3 gap-3" },
              React.createElement('div', { className: "bg-white rounded-lg p-3 shadow-sm text-center" },
                React.createElement('p', { className: "text-gray-500 text-xs" }, 'Úspěšnost'),
                React.createElement('p', { className: "font-bold text-lg" }, successRate + '%')
              ),
              
              React.createElement('div', { className: "bg-white rounded-lg p-3 shadow-sm text-center" },
                React.createElement('p', { className: "text-gray-500 text-xs" }, 'Počet sázek/měsíc'),
                React.createElement('p', { className: "font-bold text-lg" }, betCount)
              ),
              
              React.createElement('div', { className: "bg-white rounded-lg p-3 shadow-sm text-center" },
                React.createElement('p', { className: "text-gray-500 text-xs" }, 'Průměrný kurz'),
                React.createElement('p', { className: "font-bold text-lg" }, avgCoefficient)
              )
            )
          ),
          
          React.createElement('div', { className: "mb-6 border-l-4 border-yellow-500 bg-yellow-50 p-4" },
            React.createElement('h4', { className: "font-bold text-gray-800 mb-2" }, 'Důležité upozornění'),
            React.createElement('p', { className: "text-gray-700" },
              'Tyto výsledky jsou založeny na průměrné úspěšnosti našeho 7krokového systému. Skutečné výsledky se mohou lišit v závislosti na mnoha faktorech včetně disciplíny, výběru zápasů a správného dodržování všech 7 kroků našeho systému.'
            )
          ),
          
          React.createElement('div', { className: "text-center" },
            React.createElement('button', { className: "bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-lg font-bold text-lg transition-colors inline-flex items-center" },
              React.createElement('span', { className: "mr-2" }, '💰'),
              'Získat přístup k Elitní skupině'
            )
          )
        )
    )
  );
};

// Render aplikace do DOM
ReactDOM.render(React.createElement(ProfitCalculator), document.getElementById('root'));
