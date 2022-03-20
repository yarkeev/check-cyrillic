# check-cyrillic

Checking the absence of hardcode Cyrillic characters in the source code.

## Install

```
npm install check-cyrillic --save-dev
```

Add script to package.json

```
"check-cyrillic": "check-cyrillic --source='src/**/*.+(ts|tsx)'",
```

## Usage

```shell
$ npm run check-cyrillic
```

Use the **.check-cyrillic-ignore** file for ignore files

Example:

```
src/locales/ru.ts
src/constants/ru.ts
```
