# README.md

# Ход мыслей при исправлении ошибок

## Коммит №1 - "Fix bug with reducer-function data while execution createState function"

При запуске я столкнулся с ошибкой от TypeScript, которая сообщала мне о том, что не может сравнить тип `'update'` с типом `'message' | 'next' | 'prev' | 'restart' | 'theme' | 'timer'`. Данная ошибка появилась входе выполнения функции `createState` при вызове reducer-функции `data` и модуля `./src/application/data.ts`. Внутри reducer-функции `data` используется тип Action из модуля `./src/application/actions.ts`. Если посмотреть данный модуль, то можно заметить, что не экспортируется тип, который возвращает функция `actionUpdate` (его нет в объединение, которое образует тип `Action`). Я решил, что именно это и является ошибкой, так как `ReturnType<actionMessage>`, для которого нет обработки в reducer-функции, не имеет поля `data`, с которым работает reducer-функция.

### Решение

Для исправления ошибки я добавил в объединение, которое образует тип `Action` возвращаемый тип от функции `actionUpdate`.

## Коммит №2 - "Fix bug with handing 'next' action and bug with ignoring new slide index in selectors"

После запуска приложения я заметил, что кнопка "→" (следующий слайд) внтури слайда не работает. В модуле `./src/index.ts` я заметил, что listener, который вешается на кнопку по селектору `.next` вызывает `dispatch(actionPrev())` вместо `dispatch(actionNext())`. Однако, после замены одной функции на другую слайд перелистываться не начал. Тогда я решил проверить `state$` поток на обработку (обрабатываются ли новые состояния). И нашёл ошибку в модуле `./src/application/selectors.ts` - там в селекторе `createCurrentIndexSelector` последним действием на обработку элемента потока был вызов операции `mergeMapTo(EMPTY)`, что приводило к замене на пустой Observable, то есть игнорировался `index` каждого нового слайда.

### Решение

Решением стала замена вызова функции `actionPrev` на вызов функции `actionNext`. И удаление операции `mergeMapTo(EMPTY)` в селекторе `createCurrentIndexSelector`

## Коммит №3 - "Fix height of .slide-progress-value element"

Далее, я заметил, что не работает progress bar. Сначала, мне нужно было понять, почему он не отображается. С помощью Chrome devtools я обнаружил, что у элементов progress bar'а (`.slide-progress-value` элементы) высота выставлена без единиц измерения.

### Решение

Для исправления ошибки в файле `./src/index.css` в наборе объявлений у селектора `.slide-progress-value` значение для свойства height нужно выставить в `4px` вместо `4`.
