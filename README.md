# MySmartHome

This project is GAS scripts for My Smart Home.

### Support

- Switchbot API

### Scheduled to Support

- Assistant Computer Control
  - (Dropbox)

## Architecture

- GAS (Google App Script)
- clasp (a command line tool for local development to GAS)
- Typescript
  - babel
  - webpack
  - gas-webpack-plugin

## initialize

### Create your GAS Project

[https://script.google.com/home](https://script.google.com/home)

Note a **Script ID** from dashboard.


### Setup 

This project needs clasp a tool assosicates GAS. 

```
git clone git@github.com:stoikheia/MySmartHome.git
npm install
npm install -g @google/clasp
clasp login
clasp clone <Script ID>
```

### Setting for Switchbot

1. Open: your GAS Project
1. Open: script editor
1. Push: "Use Classic Editor"
1. Open: "File" -> "Project Property"
1. Push: "Script Property" Tab
1. Input: Property name "SECRET_DEVELOPER_TOKEN"
1. Build and Deploy: Check below segment
1. Check: Your device count from this system
   * use GET API
1. Check: Your device id from this system
   * use GET API with index param.
1. Input: Value is your Switchbot developer token
   * How to get your Switchbot developer token is [Here](https://github.com/OpenWonderLabs/SwitchBotAPI)
1. Input: Device keys into property name and Device ID into values
   * Your favorite string (camel_case) as your Device Keys
     * That will use to specify a device to control on this system
   * Collesponding Device IDs against the Device keys from Switchbot
1. Modify source './switchbotOwnDevices'


## build and deploy

```
npm run build
clasp push

or

npm run deploy
```
