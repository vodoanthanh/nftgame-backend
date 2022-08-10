export const feeConfig = {
  transactionFee: process.env.TRANSACTION_FEE ? Number(process.env.TRANSACTION_FEE) : 5,
  slippage: process.env.SLIPPAGE ? Number(process.env.SLIPPAGE) : 5,
};
