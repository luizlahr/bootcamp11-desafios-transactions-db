import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((total, { type, value }) => {
      let response = total;
      if (type === 'income') {
        response += value;
      }

      return response;
    }, 0);

    const outcome = transactions.reduce((total, { type, value }) => {
      let response = total;
      if (type === 'outcome') {
        response += value;
      }

      return response;
    }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
