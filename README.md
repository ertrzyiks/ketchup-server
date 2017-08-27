# ketchup

## Prerequisite

 - Node 6.x
 - NPM 5.x
 - PostgreSQL (for production)

### Development

Install dependencies

```
npm i
```

and then start the server

```
npm start
```

To run tests use:

```
npm test

# the same but in watch mode 
npm run test:watch
```

To update Ava snapshots

```
npm run test:up
```

### Production

```
npm i
npm run build
NODE_ENV=production npm run start:prod
```
