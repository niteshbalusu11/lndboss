import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { toBoolean, toNumber, toStringArray, trim } from './cast.helper';

import { Transform } from 'class-transformer';

export class accountingDto {
  @Transform(({ value }) => trim(value))
  @IsString()
  category: string;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_csv: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  is_fiat_disabled: boolean;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  month: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  rate_provider: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  year: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;
}

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

export class certValidityDaysDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  below: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;
}

export class chainDepositDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  amount: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  format: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;
}

export class chainfeesDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  blocks: number;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  file: boolean;

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

export class credentialsDto {
  @Transform(({ value }) => trim(value))
  @IsString()
  auth_type: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  cert: string;

  @IsBoolean()
  is_default: boolean;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  lnd_directory: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  macaroon: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  network_type: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  socket: string;
}

export class closedDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  limit: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;
}

export class deleteRebalanceDto {
  @Transform(({ value }) => trim(value))
  @IsString()
  invoice_id: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;
}

export class findDto {
  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  query: string;
}

export class forwardsDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  days: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  from: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  node: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  sort: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  to: string;
}

export class getRebalancesDto {
  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;
}

export class priceDto {
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  file: boolean;

  @Transform(({ value }) => trim(value))
  @IsString()
  from: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsOptional()
  symbols: string;
}

export class rebalanceDto {
  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  avoid: string[];

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  in_filters: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  in_outbound: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  in_through: string;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  max_fee: number;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  max_fee_rate: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  max_rebalance: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  out_filters: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  out_inbound: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  out_through: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  schedule: string;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  timeout_minutes: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  message_id: string;
}

export class rebalanceScheduleDto {
  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  avoid: string[];

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  in_filters: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  in_outbound: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  in_through: string;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  max_fee: number;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  max_fee_rate: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  max_rebalance: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  message_id: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  out_filters: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  out_inbound: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  out_through: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  schedule: string;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  timeout_minutes: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;
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
