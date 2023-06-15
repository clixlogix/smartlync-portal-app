# SmartLync TypeScript project setup

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Development Build](https://github.com/Stanley-Industrial-Services/smartlync-portal-app/actions/workflows/development.yml/badge.svg)](https://github.com/Stanley-Industrial-Services/smartlync-portal-app/actions/workflows/development.yml)
[![Staging Build](https://github.com/Stanley-Industrial-Services/smartlync-portal-app/actions/workflows/stage.yml/badge.svg)](https://github.com/Stanley-Industrial-Services/smartlync-portal-app/actions/workflows/stage.yml)

This repository contains a simple setup for React.js project with TypeScript.

## Project setup

```shell
git clone https://github.com/Stanley-Industrial-Services/smartlync-portal-app.git
cd smartlync-portal-app

npm install
```

## Project structure

```
/
/build   <- JavaScript build goes here to deploy
/src    <- TypeScript source code lives here
/test   <- test files (**.test.ts) live here

smartlync-portal-app/
├─ .gitignore
├─ .husky
├─ internals
├─ node_modules/
├─ public/
├─ src/
│  └─ ...
├─ package.json
├─ tsconfig.json
├─ tsconfig.prod.json
├─ tsconfig.test.json
└─ tslint.json
```

Of note:

-   `tsconfig.json` contains TypeScript-specific options for our project.
    -   We also have a `tsconfig.prod.json` and a `tsconfig.test.json` in case we want to make any tweaks to our production builds, or our test builds.
-   `tslint.json` stores the settings that our linter, [TSLint](https://github.com/palantir/tslint), will use.
-   `package.json` contains our dependencies, as well as some shortcuts for commands we'd like to run for testing, previewing, and deploying our app.
-   `public` contains static assets like the HTML page we're planning to deploy to, or images. You can delete any file in this folder apart from `index.html`.
-   `src` contains our TypeScript and CSS code. `index.tsx` is the entry-point for our file, and is mandatory.
-   `images.d.ts` will tell TypeScript that certain types of image files can be `import`-ed, which create-react-app supports.

# Running the project (Local)

Running the project is as simple as running

```sh
npm start or npm run start
```

This runs the `start` script specified in our `package.json`, and will spawn off a server which reloads the page as we save our files.
Typically the server runs at `http://localhost:3000`, but should be automatically opened for you.

This tightens the iteration loop by allowing us to quickly preview changes.

# The Application runs in default so how do we customize for tenant specific?

The customer/tenant code has been integrated into the UI.
This will cause your existing local development to not work
as expected if you only use the URL:
` http://localhost:3000/signin`
The UI now defaults to using the URL to determine to which
tenant/customer you are requesting data. This default URL and
any other invalid URL will not have a corresponding tenant
defined and so you will be rejected with an unauthorized status.

to access your data using the new method follow these steps.

```sh

1. make sure your username/email address is setup to access
   the tenant which you are requesting data.
   eg.. demo, daimler, volvo
2. update your hosts file by adding the appropriate hostname
   that matches your tenant

    Windows:
    update the hosts file located
    c:\Windows\system32\etc\hosts
    Unix/OSX:
    update the hosts file located
    /etc/hosts

    add entries for your tenant save and exit
    127.0.0.1 demo.localhost.io
    127.0.0.1 daimler.localhost.io
    127.0.0.1 volvo.localhost.io

3. Access your new tenant from your browser
   http://demo.localhost.io:3000/signin

```

# Running the project with Development mode (Prior to Development deploy)

Running the project is as simple as running

```sh
npm run start:prod
```

This runs the `start` script specified in our `package.json`, and will spawn off a server which reloads the page as we save our files.
Typically the server runs at IP address which is going to be generated in the terminal.

# Creating a production build

When running the project with `npm run start`, we didn't end up with an optimized build.
Typically, we want the code we ship to users to be as fast and small as possible.
Certain optimizations like minification can accomplish this, but often take more time.
We call builds like this "production" builds (as opposed to development builds).

To run a production build, just run

```sh
npm run build
```

This will create an optimized JS and CSS build in `./build/static/js` and `./build/static/css` respectively.

You won't need to run a production build most of the time,
but it is useful if you need to measure things like the final size of your app.

# Creating a component using Generators

Generator is a Project specific pre-written code to generate Re usable components such as widgets, services, pages.

We use Generator to create 'n' number of components within few steps

We're going to create a `HelloWorld` component using Generator

```
npm run generate page HelloWorld

? Do you want to wrap your page in React.memo ? Yes
? Do you want headers? Yes
? Do you want filters via filter panel ? Yes
? Do you want to convert PAGE helloWorld to a DASHBOARD format ? Yes
? Do you want a redux service for this page ? Yes
? What should the Service be called? HelloWorld
Checking if HelloWorld exists in  src/services
? What should the Service be called? Y
? Do you want a model for the service Y ? Yes
? What should the Model be called ? HelloWorldModel
? Do you want a redux slice(actions/selectors/reducer) for this service ? Yes
? Do you want sagas for asynchronous flows? (e.g. fetching data) Yes
? Select the sagas for asynchronous flows ?  wantReadAll
? Do you want to use styled-components? Yes
? Do you want i18n translations (i.e. will this widget use text)? Yes
? Do you want to load the page asynchronously? Yes
? Do you want to have tests? Yes

```

Below files will get generated Automatically we need to choose if we need or not

```
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\pages\HelloWorld\index.tsx
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\pages\HelloWorld\HelloWorld.tsx
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\pages\HelloWorld\HelloWorld.scss
√  +- C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\app\App.tsx
√  +- C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\app\App.tsx
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\services\HelloWorld\HelloWorld-reducer.ts
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\services\HelloWorld\HelloWorld-selectors.ts
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\services\HelloWorld\index.ts
√  +- C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\types\RootState.ts
√  +- C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\types\RootState.ts
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\services\y\sagas\data.ts
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\models\helloworld-model-model.ts
√  +- C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\models\index.ts
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\models\__tests__\helloworld-model-model.test.tsx
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\services\y\sagas\index.ts
√  +- C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\constants\index.ts
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\services\y\sagas\y-saga-get-all.ts
√  +- C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\services\y\sagas\index.ts
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\services\y\sagas\__tests__\y-saga-get-all.test.tsx
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\pages\HelloWorld\Loadable.ts
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\pages\HelloWorld\__tests__\index.test.tsx
√  ++ C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\pages\HelloWorld\messages.ts
√  +- C:\WORKSPACE-SMART-LYNC\smartlync-portal-app\src\locales\en\translation.ts
```

## npm scripts

| npm script        | description                                  |
| ----------------- | -------------------------------------------- |
| `start`           | Run compiled JavaScript code                 |
| `build`           | Compile TypeScript source code to JavaScript |
| `test`            | Run tests                                    |
| `test:generators` | Run tests to test generator files            |
| `start:prod`      | Run compiled JavaScript code in dev mode     |

`checkTs`: "tsc --noEmit",
`eslint`: "eslint --ext js,ts,tsx",
`lint` | Typecheck, lint and format TypeScript source code
`lint:fix` | Typecheck, Fix listed lint issues
`lint:css` | Typecheck, Fix listed lint issues for css files
`generate` | Run generator to create components, services, pages
`serve` | Run TypeScript source code directly with `ts-node`
`prettify` | Run Prettify to format the code
`extract-messages`: "i18next-scanner --config=internals/extractMessages/i18next-scanner.config.js",
`prepare`: "husky install"

## License

[MIT](./LICENSE)
