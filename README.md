
## Coinburp Demo (Auth & Rate Limiter)

## Installation

To download and run this repository, run the following command:
```bash
$ git clone https://github.com/PatrickGeyer/coinburp-demo.git . \
  && npm install \
  && npm run start:dev
```
To test distinct endpoints use the following commands:

export AUTH_TOKEN=$(curl localhost:3000/auth/login -X POST -d '{"email": "admin@coinburp.com", "password": "password"}' -H "Content-Type: application/json")
curl localhost:3000/trade  -H 'x-access-token: '$AUTH_TOKEN''