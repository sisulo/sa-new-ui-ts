# SaAdminTs

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.4.

## Prerequisites

- install node.js on server/local machine
npm install -g @angular/cli
npm install typings --save --global
## Installation steps on production

1. git pull sa-new-ui-ts
1. goto sa-new-ui-ts
1. set correct configuration in environments/environment.prod.ts
1. ng build -prod
   
   It compile source code and create in re **../sa-admin-local-app/** all application javascript files.
   If necessary when create sa-admin-local-app directory first.

1.  create new vhost on apache if necessary to handle request on sa-admin-local-app 
