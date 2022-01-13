import {TotalPortfolioData} from 'frontend-core/dist/models/total-portfolio';
import {User} from 'frontend-core/dist/models/user';

export default function isCompensationCappingExceeded(totalPortfolio: TotalPortfolioData, user: User): boolean {
    const {totalCash} = totalPortfolio;
    const compensationCapping: number | undefined = user.accountInfo?.compensationCapping;

    if (totalCash === undefined || compensationCapping === undefined) {
        return false;
    }

    return totalCash > compensationCapping;
}
