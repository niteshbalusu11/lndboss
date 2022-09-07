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
  @IsOptional()
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
  @IsOptional()
  @IsNumber()
  above: number;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  below: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_confirmed: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_detailed: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_offchain_only: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_onchain_only: boolean;
}

export class certValidityDaysDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  below: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
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
  @IsOptional()
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
  @IsOptional()
  @IsString()
  node: string;
}

export class chartChainFeesDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  days: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  end_date: string;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsOptional()
  nodes: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  start_date: string;
}

export class chartFeesEarnedDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  days: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  end_date: string;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_count: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_forwarded: boolean;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsOptional()
  nodes: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  start_date: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  via: string;
}

export class chartFeesPaidDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  days: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  end_date: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  in: string;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_most_fees_table: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_most_forwarded_table: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_network: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_peer: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_rebalances_only: boolean;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsOptional()
  nodes: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  out: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  start_date: string;
}

export class chartPaymentsReceivedDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  days: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  end_date: string;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsOptional()
  nodes: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  start_date: string;
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
  @IsOptional()
  @IsString()
  node: string;
}

export class deleteRebalanceDto {
  @Transform(({ value }) => trim(value))
  @IsString()
  id: string;
}

export class findDto {
  @Transform(({ value }) => trim(value))
  @IsOptional()
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
  @IsOptional()
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

export class graphDto {
  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  filters: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  query: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  sort: string;
}

export class grpcDto {
  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;
}

export class lnurlDto {
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  amount: number;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  avoid: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  function: string;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_private: boolean;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  max_fee: number;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  max_paths: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  message_id: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  out: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  url: string;
}

export class payDto {
  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  avoid: string[];

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
  max_paths: number;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  message: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  message_id: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  out: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  request: string;
}

export class peersDto {
  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  earnings_days: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  filters: string[];

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  idle_days: number;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_offline: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_private: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_public: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_table: boolean;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  omit: string[];

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  sort_by: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  tags: string[];
}

export class priceDto {
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  file: boolean;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  from: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsOptional()
  symbols: string;
}

export class probeDto {
  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  avoid: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  destination: string;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  find_max: boolean;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  in_through: string;

  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsNumber()
  max_paths: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  message_id: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  out: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  tokens: string;
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

export class reconnectDto {
  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  node: string;
}

export class sendDto {
  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  amount: string;

  @Transform(({ value }) => toStringArray(value))
  @IsOptional()
  @IsArray()
  avoid: string[];

  @Transform(({ value }) => trim(value))
  @IsString()
  destination: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  in_through: string;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_dry_run: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  is_omitting_message_from: boolean;

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
  message: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  message_id: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  out_through: string;

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
