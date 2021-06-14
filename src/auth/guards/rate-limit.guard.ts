import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRateLimit, RATELIMIT_KEY } from './decorator/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  // Stores list of requests that have entered the application
  private requests: { uid: number, endpoint: string, time: Date }[] = []

  canActivate(context: ExecutionContext): boolean {

    // Gets 'rate limit' metadata from endpoint
    const limiters = this.reflector.getAllAndOverride<IRateLimit[]>(RATELIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no rate limiters defined, allow all requests
    if (!limiters) {
      return true;
    }

    const { user, path } = context.switchToHttp().getRequest();

    if (user) {

      // If too many requests found within timeframe for any rate limit, throw TooManyRequests exception
      if (limiters.some((limit) => {

        // Earliest cutoff time for this ratelimit
        const timeframe = new Date().valueOf() - timeframes[limit.per];

        return this.requests.filter(u =>
          u.endpoint === path &&
          u.uid === user.uid &&
          u.time.valueOf() >= timeframe).length >= limit.count;
      })) {
        throw new HttpException(`Endpoint hit too many times`, 429)
      }

      this.requests.push({
        uid: user.uid,
        endpoint: path,
        time: new Date()
      })
    }

    return true;
  }
}

const timeframes = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24
}