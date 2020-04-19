import csv from 'csvtojson';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const transactionList = await csv().fromFile(filePath);
    const transactions: Transaction[] = [];

    for (const transaction of transactionList) {
      const { title, type, value, category } = transaction;
      const newTransaction = await createTransactionService.execute({
        title,
        type,
        value,
        category,
      });
      transactions.push(newTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
