# README.md

# Ход мыслей при исправлении ошибок

## Коммит №1 - "Fix bug with reducer-function data while execution createState function"

При запуске я столкнулся с ошибкой от TypeScript, которая сообщала мне о том, что не может сравнить тип `'update'` с типом `'message' | 'next' | 'prev' | 'restart' | 'theme' | 'timer'`. Данная ошибка появилась входе выполнения функции `createState` при вызове reducer-функции `data` и модуля `./src/application/data.ts`. Внутри reducer-функции `data` используется тип Action из модуля `./src/application/actions.ts`. Если посмотреть данный модуль, то можно заметить, что не экспортируется тип, который возвращает функция `actionUpdate` (его нет в объединение, которое образует тип `Action`). Я решил, что именно это и является ошибкой, так как `ReturnType<actionMessage>`, для которого нет обработки в reducer-функции, не имеет поля `data`, с которым работает reducer-функция.

### Решение

Для исправления ошибки я добавил в объединение, которое образует тип `Action` возвращаемый тип от функции `actionUpdate`.

## Коммит №2 - "Fix bug with handing 'next' action and bug with ignoring new slide index in selectors"

После запуска приложения я заметил, что кнопка "→" (следующий слайд) внутри слайда не работает. В модуле `./src/index.ts` я заметил, что listener, который вешается на кнопку по селектору `.next` вызывает `dispatch(actionPrev())` вместо `dispatch(actionNext())`. Однако, после замены одной функции на другую слайд перелистываться не начал. Тогда я решил проверить `state$` поток на обработку (обрабатываются ли новые состояния). И нашёл ошибку в модуле `./src/application/selectors.ts` - там в селекторе `createCurrentIndexSelector` последним действием на обработку элемента потока был вызов операции `mergeMapTo(EMPTY)`, что приводило к замене на пустой Observable, то есть игнорировался `index` каждого нового слайда.

### Решение

Решением стала замена вызова функции `actionPrev` на вызов функции `actionNext`. И удаление операции `mergeMapTo(EMPTY)` в селекторе `createCurrentIndexSelector`.

## Коммит №3 - "Fix height of .slide-progress-value element"

Далее, я заметил, что не работает progress bar. Сначала, мне нужно было понять, почему он не отображается. С помощью Chrome devtools я обнаружил, что у элементов progress bar'а (`.slide-progress-value` элементы) высота выставлена без единиц измерения.

### Решение

Для исправления ошибки в файле `./src/index.css` в наборе объявлений у селектора `.slide-progress-value` значение для свойства `height` нужно выставить в `4px` вместо `4`.

## Коммит №4 - "Fix changeSlideEffect"

При наблюдении за работой progress bar'а, я заметил, что progress bar перестаёт заполняться для последнего слайда, а слайде не перелистывается. Данная ошибка связана с тем, что в модуле `./src/application/effects` в функции `createEffects` поток `changeSlideEffect` был ограничен пятью повторениями с помощью оператора `take`.

### Решение

Для решения проблемы необходимо убрать оператор `take`. Во избежание дополнительных ошибок, стоит добавить, также, проверку на текущий индекс, чтобы не создавать action 'next', когда индекс (`state.index`) последний в массиве данных для слайдов (`state.stories`).
Итоговая проверка: `state.index < state.stories.length - 1`.

## Коммит №5 - "Fix bug with theme changing"

При переключении темы приложения по кнопке, список классов тега `body` изменялся - добавлялся новый класс без удаления старого (говорится о классах `.theme_light` и `.theme_dark`), из-за чего неправильно вели себя кнопки для работы со переключения темы → свойство `display` кнопки для переключения темы на светлую всегда оставалось в значении `none`.

### Решение

Для исправления ошибки необходимо изменить функцию `setElementTheme` из модуля `./src/application/views.ts`. Здесь, я подумал, что если в какой-то момент понадобится добавить новую тему будет неудобно снова изменять данную функцию, поэтому я в модуле `./src/application/types.ts` добавил и экспортировал новую константу - `possibleThemes` - массив, содержащий всевозможные темы приложения. Далее, в функции `setElementTheme` перед добавлением нового класса, я добавил проверку на наличие класса другой темы и удаление в случае успешной проверке.

## Коммит №6 - "Set default theme to dark"

В описании плеера сказано, что по умолчанию тема должна быть тёмной. В коде была выставлена светлая тема по умолчанию.

### Решение

Для изменения темы по умолчанию я в файлах `./src/index.html` и `./src/frame.html` изменил начальный класс тега `body` на `.theme_dark`, а также в модуле `./src/application/state.ts` изменил константу `DEFAULT_STATE` - поменял значение `theme` на `'dark'`.

Данную ошибку можно было решить другим способом - можно было после в модуле `./src/index.ts` после загрузки страницы и по после загрузки каждого фрейма вызывать функцию для смены темы, но это было бы менее эффективно и требовало бы написания дополнительного кода, поэтому был выбран первый вариант.

## Коммит №7 - "Fix visibility of 'prev' action button"

На экранах с высотой меньше (или ровно), чем `750px` пропадает кнопка с селектором `.prev`. Данная ошибка возникает из-за того, что в файле `./src/index.css` для данного селектора прописан медиа-запрос, который выставляет свойству `display` значение `none`.

### Решение

Для решения данной проблемы необходимо убрать данный медиа-запрос. Медиа-запрос является именно ошибкой, так как на самом маленьком экране (`320px` в высоту и шириной `568px`) все кнопки для управления плеером помещаются.

## Коммит №8 - "Fix error with click on not interactive element"

При клике на неинтерактивный элемент в консоле появляется ошибка, сообщающая о попытке прочитать свойство `dataset` у `null`. Данная ошибка возникала из-за того, что пользователь мог нажать на неинтерактивный элемент, родители которого тоже не являются интерактивными, поэтому происходила попытка чтения несуществующего свойства (у элемента `html` свойство `parentElement` - `null`).

### Решение

Для исправления ошибки необходимо добавить проверку на `null` переменной `target`. `null` при приведении к `boolean` будет `false`, в то время как любой `HTMLElement` будет объектом ⇒ будет `true`, поэтому проверка может быть следующей: `if (target) {...}`.

Есть ещё много проверок, но сути они не меняют (например, самая простая - `if (target !== null) {...}`).
