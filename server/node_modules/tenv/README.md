# tenv

A lib to conveniently handle environment variables the typescript way including defaults and fallbacks.

## Getting started

install the module with

```
npm install tenv
```

or

```
yarn add --dev tenv
```

I recomment creating a `env.ts` file do the import and initialization there

```js
import tenv from "tenv";

export const env = new tenv();

// other setup here
```

## How to contribute

I'm really glad you're reading this.

Submitting changes

- Fork this repository
- Create a branch in your fork
- Send a Pull Request along wih a clear description of your changes as well as specs

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

```
\$ git commit -m "A brief summary of the commit

> A paragraph describing what changed and its impact."
> Coding conventions
> Start reading our code and you'll get the hang of it. We optimize for readability:
```
