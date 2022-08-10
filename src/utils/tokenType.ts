import contract from '@config/contracts';

export const getTokenAddress = (tokenType: string) => {
  switch (tokenType) {
    case 'USDT':
      return contract.USDT.address;
    case 'RUNNOW':
      return contract.RUNNOW.address;
    case 'RUNGEM':
      return contract.RUNGEM.address;
    case 'GENI':
      return contract.GENI.address;
    default:
      return contract.RUNNOW.address;
  }
};

export const getTokenType = (tokenAddress: string) => {
  switch (tokenAddress.toLowerCase()) {
    case contract.USDT.address.toLowerCase():
      return 'USDT';
    case contract.RUNNOW.address.toLowerCase():
      return 'RUNNOW';
    case contract.RUNGEM.address.toLowerCase():
      return 'RUNGEM';
    case contract.GENI.address.toLowerCase():
      return 'GENI';
    default:
      return 'RUNNOW';
  }
};
