### запуск
```
npm install
npm start
```

### deploy
```
shipit staging deploy
```

### DB
```
createdb wgt_db
```
создаем в корне проекта файл secrets.js
с содержимым:
```
module.exports = {
    development: {
        dbConfig: {
            name: 'wgt_db',
            host: 'localhost',
            user: 'marina',
            pass: '1234567890'
        }
    }
}
```
```
npm i --g knex
```
```
knex migrate:latest
npm run seed
```
--

frontend лежит в папке client

backend в папке server

config webpack в папке webpack

