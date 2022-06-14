import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { toBoolean, toNumber, toStringArray, trim } from './cast.helper';

export class authenticationDto {
  @Transform(({ value }) => trim(value))
  @IsString()
  username: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  password: string;
}

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

  @Transform(({ value }) => toStringArray(value))
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

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsOptional()
  nodes: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  via: string;
}

export class chartFeesPaidDto {
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  days: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  in?: string;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_most_fees_table?: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_most_forwarded_table?: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_network?: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_peer?: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_rebalances_only?: boolean;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsOptional()
  nodes: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  out?: string;
}

export class chartPaymentsReceivedDto {
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  days: number;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsOptional()
  nodes: string[];
}

class credentials {
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
export class credentialsDto {
  @ValidateNested()
  @Type(() => credentials)
  postBody: credentials;
}

export class tagsDto {
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  add: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  icon: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  id: string;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_avoided: boolean;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  remove: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  tag: string;
}
