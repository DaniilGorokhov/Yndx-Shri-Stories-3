# README.md

# Ход мыслей при исправлении ошибок

## Коммит №1 - "Fix bug with reducer-function data while execution createState function"

При запуске я столкнулся с ошибкой от TypeScript, которая сообщала мне о том, что не может сравнить тип `'update'` с типом `'message' | 'next' | 'prev' | 'restart' | 'theme' | 'timer'`. Данная ошибка появилась входе выполнения функции `createState` при вызове reducer-функции `data` и модуля `./src/application/data.ts`. Внутри reducer-функции `data` используется тип Action из модуля `./src/application/actions.ts`. Если посмотреть данный модуль, то можно заметить, что не экспортируется тип, который возвращает функция `actionUpdate` (его нет в объединение, которое образует тип `Action`). Я решил, что именно это и является ошибкой, так как `ReturnType<actionMessage>`, для которого нет обработки в reducer-функции, не имеет поля `data`, с которым работает reducer-функция.

### Решение

Для исправления ошибки я добавил в объединение, которое образует тип `Action` возвращаемый тип от функции `actionUpdate`.
