# Refactor examples

Project to demonstrate the power of working with the AST and TypeScrip compiler

## Project structure

- **sample-project**  
  the project that will be refactored using the scripts in `refactor-scripts`
  and `my-org-refactor-lib`
- **my-org-refactor-lib**  
  library that contains `@angular-devkit/schematics` scripts
- **refactor-scripts**  
  library that contains `ts-morph` scripts

## Executing refactors

Install (and build) packages in all projects

```sh
cd sample-project && npm install && cd .. \
cd my-org-refactor-lib && npm install && npm run build && cd .. \
cd refactor-scripts && npm install && npm run build && cd ..
```

Execute `@angular-devkit/schematics` migration

> you need the schematics cli installed globally: \
> `npm install --global @angular-devkit/schematics-cli`

```sh
cd sample-project && schematics ../my-org-refactor-lib:use-parse-float --dry-run=false
```

Execute `ts-morph` migration

```sh
cd sample-project && node ../refactor-scripts/src/extract-helpers.js
```
