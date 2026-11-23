# Власний splash screen у Flenta Mobile

Інструкція для поточної dev станом на 23 листопада 2026 року: Expo SDK 58, expo-splash-screen ~58.0.14, Expo Router. Налаштовуємо логотип по центру на суцільному фоні. Власний дизайн або нові зображення цим документом не додаються.

## Де це вже налаштовано

У `app.json` уже є плагін:

```json
[
  "expo-splash-screen",
  {
    "backgroundColor": "#208AEF",
    "image": "./assets/images/splash-icon.png",
    "imageWidth": 76
  }
]
```

Це один елемент масиву `expo.plugins`. Залиши решту плагінів на місці. Іконка застосунку `expo.icon` налаштовується окремо.

У `src/app/_layout.tsx` splash утримується через `preventAutoHideAsync()` до завершення завантаження Manrope. Коли `useFonts` повертає `loaded` або помилку, викликається `hideAsync()` і відображається застосунок. Очікування мережі, авторизації чи KYC до цього механізму не додано, тому відсутній API не має утримувати native splash.

## 1. Підготуй зображення
 Для splash Expo рекомендує прозорий PNG 1024×1024. [Вимоги Expo до splash-зображення](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/#create-a-splash-screen-icon).

Поклади файли, наприклад, сюди:

```text
assets/images/flenta-splash.png
assets/images/flenta-splash-dark.png
```

Це приклади нових назв, у репозиторії цих файлів поки немає. Якщо хочеш мінімум змін, просто заміни наявний `assets/images/splash-icon.png` своїм PNG та залиш старий шлях.

Якщо логотип здається малим, перевір прозорі поля всередині самого PNG: вони теж масштабуються разом із зображенням.

## 2. Зміни тільки наявний запис плагіна

Після додавання файлів заміни цей запис у `expo.plugins`:

```json
[
  "expo-splash-screen",
  {
    "backgroundColor": "#F4F7FC",
    "image": "./assets/images/flenta-splash.png",
    "imageWidth": 160,
    "resizeMode": "contain",
    "dark": {
      "backgroundColor": "#0F172A",
      "image": "./assets/images/flenta-splash-dark.png"
    }
  }
]
```

Кольори та 160 — приклад. `imageWidth` керує розміром логотипа на екрані, а не роздільністю вихідного PNG. Якщо окремого темного зображення немає, прибери `dark.image` або весь блок `dark`. Не залишай шлях до неіснуючого файлу. Ці поля підтримує встановлений config plugin. [Довідник параметрів SplashScreen](https://docs.expo.dev/versions/latest/sdk/splash-screen/#configurable-properties).

Native splash і режим `mode` у ThemeProvider — окремі налаштування. Не розраховуй, що збережений у JS вибір теми автоматично підмінить native-зображення до запуску JS.

## 3. Не дублюй логіку очікування

У `_layout.tsx` уже є обидва потрібні виклики. Не додавай другу незалежну пару prevent/hide в екран входу або ThemeProvider.

Залиш виклик prevent у модульній області та приховування після готовності шрифтів. У цьому проході до обох Promise додано обробку відмов. При помилці шрифтів застосунок також має перейти до показу екрана, а не чекати успішного завантаження нескінченно.

Не додавай штучну затримку на кілька секунд лише заради показу логотипа. За потреби анімований вступ можна спроєктувати окремим React Native екраном після native splash.

```

У виводі config перевір шлях, фон і наявність єдиного запису expo-splash-screen. Ця команда читає конфігурацію, але не доводить, що картинка виглядає правильно на телефоні.

Для перевірки bundles налаштуй HTTPS адресу бекенда у своєму середовищі та виконай:

```sh
npx expo export --platform all
```

## 4. Перезбери й перевстанови застосунок

Зміни native splash у `app.json` потребують нової native-збірки. Fast Refresh, перезапуск Metro з `--clear` або JS-оновлення не є такою збіркою.

Для остаточного візуального результату використовуй preview/production build: Expo Go та development client можуть показувати власні launch-екрани і не відтворювати всі налаштування splash. [Рекомендація Expo щодо перевірки на release build](https://docs.expo.dev/versions/latest/sdk/splash-screen/).

Варіанти залежно від налаштованого середовища команди:

```sh
# Локальний Android release; потрібні JDK, Android SDK і пристрій/емулятор
npx expo run:android --variant release

# Локальний iOS release; потрібні macOS та Xcode
npx expo run:ios --configuration Release
```

Якщо команда вже налаштувані EAS і профіль `preview`, можна користуватися її pipeline. Наприклад:

```sh
npx eas-cli@latest build --platform android --profile preview
```

У поточній dev немає `eas.json`, тому остання команда не є готовим pipeline цього репозиторію. Спочатку потрібне командне налаштування EAS, ідентифікаторів застосунку, профілю та підписування. Для самої зміни логотипа не потрібно видаляти android/ios або запускати `prebuild --clean` навмання.



