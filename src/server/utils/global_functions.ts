import { HttpException, Logger } from '@nestjs/common';

const stringify = (data: any) => JSON.stringify(data, null, 2);
const isString = (n: any) => typeof n === 'string';
const { isArray } = Array;
const isNumber = (n: any) => !isNaN(n);

export const logger = ({ error }: { error: any }) => {
  Logger.error(stringify(error));

  if (isArray(error) && !!error.length && isString(error[1]) && isNumber(error[0])) {
    throw new HttpException(String(error[1]), Number(error[0]));
  } else {
    throw new HttpException('UnexpectedErrorGettingInformation', 503);
  }
};
