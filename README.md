
# Coinburp Demo (Authentication & Rate Limiter)

## Installation

To download and run this repository, run the following command:
```bash
$ git clone https://github.com/PatrickGeyer/coinburp-demo.git . \
  && npm install \
  && npm run start:dev
```

To login, run the following command:
```export AUTH_TOKEN=$(curl localhost:3000/auth/login -X POST -d '{"email": "admin@coinburp.com", "password": "password"}' -H "Content-Type: application/json")```
Can login as admin@coinburp.com or user@coinburp.com. Password="password" for both.

To hit an endpoint, use the following command `curl localhost:3000/trade  -H 'x-access-token: '$AUTH_TOKEN''`

A selection of tests can be found in the `test` directory. To run them use `npm run test:e2e`
## About
The app consists of the following endpoints: 

```
GET price (open endpoint)
GET trade (must be authenticated, rate limited)
GET users (must be authenticated admin)

POST auth/login (returns jwt token based on email & password provided)
```

It uses a basic middleware function to parse the `x-access-token` header for every request if provided, and attaches the verified user details to the request object to be used downstream.

Then, there are two global guards applied. The `RolesGuard` and `RateLimitGuard`. A guard is an interface for a piece of middleware in NestJS that exposes the method `canActivate` to check if the current request should proceed executing. 
For every incoming request, we can check the metadata attached to the endpoint that is about to be accessed, in order to see if we need to restrict access or apply rate limiting.
The metadata is attached to controller routes via the custom decorators `Roles('admin' | 'user')` and `RateLimit(1: number, 'hour')`.

E.g.

```
@Get('admin-endpoint')
@Roles('admin')
restrictedEndpoint() {
  // Application has the global RolesGuard middleware attached. The middleware executes before this function is reached. (main.ts useGlobalGuard)
  // On a request, it reads the 'roles' metadata applied this endpoint function to determine if the requesting user is able to access it.
  return x;
}
```

Happy coding!