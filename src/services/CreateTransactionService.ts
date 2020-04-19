import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const { total } = await transactionRepo.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Insuficient Balance for this transaction', 400);
    }

    const categoryId = await this.getCategoryId(category);

    const transaction = await transactionRepo.save({
      title,
      value,
      type,
      category_id: categoryId,
    });

    return transaction;
  }

  private async getCategoryId(title: string): Promise<string> {
    const categoryRepo = getRepository(Category);
    const category = await categoryRepo.findOne({ where: { title } });

    if (category) {
      return category.id;
    }

    const { id } = await categoryRepo.save({
      title,
    });

    return id;
  }
}

export default CreateTransactionService;
