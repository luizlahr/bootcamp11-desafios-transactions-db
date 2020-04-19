import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepo = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepo.find({
    select: ['id', 'title', 'value', 'type', 'category'],
    relations: ['category'],
  });
  const balance = await transactionRepo.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { filename } = request.file;
    const filePath = path.join(uploadConfig.directory, filename);
    const checkFile = fs.promises.stat(filePath);

    if (!checkFile) {
      throw new AppError('Error while importing file');
    }
    const importService = new ImportTransactionsService();
    const transactions = await importService.execute(filePath);
    return response.json(transactions);
  },
);

export default transactionsRouter;
