import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const transaction = await transactionRepo.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionRepo.delete(id);
  }
}

export default DeleteTransactionService;
