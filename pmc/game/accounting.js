// 会计系统
const Accounting = {
    // 月度财务计算
    calculateMonthly: function() {
        const state = GameState.get();
        
        let monthlyIncome = 0;
        let monthlyExpense = 0;
        
        // 计算本月收入和支出
        const currentMonth = state.date.getMonth();
        const currentYear = state.date.getFullYear();
        
        state.transactions.forEach(function(tx) {
            const txDate = new Date(tx.date);
            if (txDate.getMonth() === currentMonth && 
                txDate.getFullYear() === currentYear) {
                if (tx.type === GameTypes.TransactionType.INCOME) {
                    monthlyIncome += tx.amount;
                } else {
                    monthlyExpense += tx.amount;
                }
            }
        });
        
        // 更新月度利润
        state.company.monthlyProfit = monthlyIncome - monthlyExpense;
    },
    
    // 生成财务报表
    generateReport: function() {
        const state = GameState.get();
        
        return {
            balanceSheet: {
                assets: {
                    cash: state.company.cash,
                    land: state.land.filter(function(l) {
                        return l.status === GameTypes.LandStatus.OWNED;
                    }).reduce(function(sum, l) {
                        return sum + l.price;
                    }, 0),
                    projectsInProgress: state.projects.filter(function(p) {
                        return p.status !== GameTypes.ProjectStatus.COMPLETED;
                    }).reduce(function(sum, p) {
                        return sum + p.landCost + (p.constructionCost * p.progress / 100);
                    }, 0)
                },
                liabilities: state.loans.filter(function(l) {
                    return l.status === GameTypes.LoanStatus.ACTIVE;
                }).reduce(function(sum, l) {
                    return sum + l.remainingBalance;
                }, 0),
                equity: 0
            },
            incomeStatement: {
                revenue: state.transactions.filter(function(tx) {
                    return tx.type === GameTypes.TransactionType.INCOME;
                }).reduce(function(sum, tx) {
                    return sum + tx.amount;
                }, 0),
                expenses: state.transactions.filter(function(tx) {
                    return tx.type === GameTypes.TransactionType.EXPENSE;
                }).reduce(function(sum, tx) {
                    return sum + tx.amount;
                }, 0),
                netProfit: 0
            }
        };
    }
};

// 经济系统
const Economy = {
    // 更新市场
    updateMarket: function() {
        const state = GameState.get();
        const market = state.market;
        
        // 随机波动
        market.interestRate += Utils.random(-0.002, 0.002);
        market.interestRate = Utils.clamp(market.interestRate, 0.03, 0.1);
        
        market.inflationRate += Utils.random(-0.001, 0.001);
        market.inflationRate = Utils.clamp(market.inflationRate, 0, 0.05);
        
        market.landPriceIndex += Utils.random(-0.02, 0.03);
        market.landPriceIndex = Utils.clamp(market.landPriceIndex, 0.8, 1.5);
        
        market.housingPriceIndex += Utils.random(-0.02, 0.03);
        market.housingPriceIndex = Utils.clamp(market.housingPriceIndex, 0.8, 1.5);
        
        market.marketSentiment += Utils.random(-0.05, 0.05);
        market.marketSentiment = Utils.clamp(market.marketSentiment, 0.2, 1);
    },
    
    // 计算土地估值
    calculateLandValue: function(land) {
        const state = GameState.get();
        return land.price * state.market.landPriceIndex;
    },
    
    // 计算房价指数影响
    getHousingMultiplier: function() {
        const state = GameState.get();
        return state.market.housingPriceIndex;
    },
    
    // 市场情绪影响
    getSentimentMultiplier: function() {
        const state = GameState.get();
        return 0.8 + state.market.marketSentiment * 0.4;
    }
};
