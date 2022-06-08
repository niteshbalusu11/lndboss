import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { toBoolean, toNodes, toNumber, trim } from './cast.helper';

import { Transform } from 'class-transformer';

export class balanceDto {
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  above: number;

  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  below: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_confirmed: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_detailed: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_offchain_only: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_onchain_only: boolean;
}

export class chainDepositDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  amount: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;
}

export class chartChainFeesDto {
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  days: number;

  @Transform(({ value }) => toNodes(value))
  @IsArray()
  @IsOptional()
  nodes: string[];
}

export class chartFeesEarnedDto {
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  days: number;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_count: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_forwarded: boolean;

  @Transform(({ value }) => toNodes(value))
  @IsArray()
  @IsOptional()
  nodes: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  via: string;
}

export class loginDto {
  @Transform(({ value }) => trim(value))
  @IsString()
  cert: string;

  @IsBoolean()
  is_default: boolean;

  @Transform(({ value }) => trim(value))
  @IsString()
  macaroon: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  socket: string;
}
