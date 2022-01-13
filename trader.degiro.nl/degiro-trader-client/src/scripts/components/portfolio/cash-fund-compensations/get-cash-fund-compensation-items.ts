import {TotalPortfolioData} from 'frontend-core/dist/models/total-portfolio';
import {User} from 'frontend-core/dist/models/user';
import hasFlatexBankAccount from 'frontend-core/dist/services/user/has-flatex-bank-account';
import {CashFundCompensation} from '../../../models/portfolio';

export default function getCashFundCompensationItems(
    totalPortfolio: TotalPortfolioData,
    currentClient: User
): CashFundCompensation[] {
    const {
        cashFundCompensationCurrency,
        cashFundCompensation,
        cashFundCompensationWithdrawn,
        cashFundCompensationPending
    } = totalPortfolio;

    if (!cashFundCompensationCurrency) {
        return [];
    }

    if (!cashFundCompensation && !cashFundCompensationWithdrawn && !cashFundCompensationPending) {
        return [];
    }

    const withdrawnItem: CashFundCompensation = {
        id: 'withdrawn',
        translation: 'trader.cashFundCompensations.withdrawnCompensation',
        currency: cashFundCompensationCurrency,
        amount: cashFundCompensationWithdrawn
    };

    if ((cashFundCompensation || 0) < 0.01 && hasFlatexBankAccount(currentClient)) {
        if ((cashFundCompensationWithdrawn || 0) >= 0.01) {
            return [withdrawnItem];
        }
        return [];
    }

    return [
        {
            id: 'accrued',
            translation: 'trader.cashFundCompensations.accruedCompensation',
            currency: cashFundCompensationCurrency,
            amount: cashFundCompensation
        },
        {
            id: 'pending',
            translation: 'trader.cashFundCompensations.pendingCompensation',
            currency: cashFundCompensationCurrency,
            amount: cashFundCompensationPending
        },
        withdrawnItem
    ];
}
