import { SetMetadata } from '@nestjs/common';

type timeframe = 'second' | 'minute' | 'hour' | 'day';
export interface IRateLimit {
    count: number;
    per: timeframe;
}
export const RATELIMIT_KEY = 'ratelimit';
export const RateLimit = (count: number, per: timeframe) => SetMetadata(RATELIMIT_KEY, [{count, per}]);