const SECRET_DEVELOPER_TOKEN = PropertiesService.getScriptProperties().getProperty("SECRET_DEVELOPER_TOKEN");

const HOST = "https://api.switch-bot.com";
const DEVICE_LIST_PATH = "/v1.0/devices";
const DEVICE_STATUS_PATH = "/v1.0/devices/{deviceId}/status";
const DEVICE_CONTROL_PATH = "/v1.0/devices/{deviceId}/commands"

const DESK_LIGHT1_ID = PropertiesService.getScriptProperties().getProperty("DESK_LIGHT1_ID");
const OWL_PLUG_ID = PropertiesService.getScriptProperties().getProperty("OWL_PLUG_ID");

const DEVICE_TABLE = {
  desk_light1 : DESK_LIGHT1_ID,
  owl_plug : OWL_PLUG_ID,
};

const DEVICE_META = {
  desk_light1 : {
    deviceType: 'Bulb',
  },
  owl_plug : {
    deviceType: 'Plug',
  }
};

function createDeviceControlPath(deviceId) {
  return DEVICE_CONTROL_PATH.replace('{deviceId}', deviceId);
}

function createDeviceStatusPath(deviceId) {
  return DEVICE_STATUS_PATH.replace('{deviceId}', deviceId);
}


function switchbotListGET() {  
  return UrlFetchApp.fetch(HOST + DEVICE_LIST_PATH, {
    'method': 'GET',
    'headers' : {
      'authorization': SECRET_DEVELOPER_TOKEN,
    },
    'muteHttpExceptions': true,
  });
}

function switchbotStatusGET(deviceId) {
  return UrlFetchApp.fetch(HOST + createDeviceStatusPath(deviceId), {
    'method': 'GET',
    'headers' : {
      'authorization': SECRET_DEVELOPER_TOKEN,
    },
    'muteHttpExceptions': true,
  });
}

function createErrorMessageWhenFetchSwitchbotAPI(response) {
  return 'Fetch SwitchbotAPI Failed : ' + response.getResponseCode() + ' ' + response.getContentText();
}

function createOutputObject(message) {
  console.log('createOutputObject : ' + message);
  return ContentService.createTextOutput(message);
}

function outputDeviceCount() {
  const response = switchbotListGET();
  if (200 == response.getResponseCode()) {
    const json = JSON.parse(response.getContentText());
    const deviceList = json.body.deviceList;
    return createOutputObject('DeviceCount : ' + deviceList.length);
  } else {
    return createOutputObject(createErrorMessageWhenFetchSwitchbotAPI(response));
  }
}

function outputDeviceInfoByIndex(i) {
  const response = switchbotListGET();
  if (200 == response.getResponseCode()) {
    const json = JSON.parse(response.getContentText());
    const deviceList = json.body.deviceList;
    if (i < deviceList.length) {
      return createOutputObject('Device' + i + ' : ' + JSON.stringify(deviceList[i], null, 2));
    } else {
      return createOutputObject('Invalid Argument : DeviceInfo OutOfIndex ' + i + '<' + deviceList.length);
    }
  } else {
    return createOutputObject(createErrorMessageWhenFetchSwitchbotAPI(response));
  }
}

function outputBareDeviceInfo() {
  const response = switchbotListGET();
  if (200 == response.getResponseCode()) {
    return createOutputObject('BareDeviceInfo : ' + response.getContentText());
  } else {
    return createOutputObject(createErrorMessageWhenFetchSwitchbotAPI(response));
  }
}

function doGet(e) {
  if (Object.keys(e.parameter).length === 0) {
    return outputDeviceCount();
  }
  const param = e.parameter;
  if (param.index) {
    return outputDeviceInfoByIndex(param.index);
  }
  if (param.bare && Integer.parse(param.bare) !== 0) {
    return outputBareDeviceInfo();
  }
  return createOutputObject('Invalid Request');
}


function switchbotControlPOST(deviceId, json) {
    return UrlFetchApp.fetch(HOST + createDeviceControlPath(deviceId), {
      'method': 'POST',
      'headers' : {
        'authorization': SECRET_DEVELOPER_TOKEN,
        'content-type': 'application/json',
      },
      'payload': JSON.stringify(json, null, null),
      'muteHttpExceptions': true,
    });
}

function outputSwitchbotControl(key, params) {
  if (hookExCommand(key, params[key])) {
    return createOutputObject('Succeeded : ' + key + ' : (Ex)' + params[key].command);
  } else {
    const response = switchbotControlPOST(DEVICE_TABLE[key], params[key]);
    if (200 == response.getResponseCode()) {
      return createOutputObject('Succeeded : ' + key + ' : ' + params[key].command);
    } else {
      throw 'Failed : ' + key + ' : ' + params[key].command + ' : ' + response.getResponseCode();
    }
  }
}

function doPost(e) {
  const params = JSON.parse(e.postData.getDataAsString());
  const keys = Object.keys(params);
  let count = 0;
  try {
    keys.forEach(key => {
      if (DEVICE_TABLE[key]) {
        count++;
        const ret = outputSwitchbotControl(key, params);
        console.log(ret.getContent());
      } else {
        throw 'Error : ' + key + ' not found';
      }
    });
  } catch (err) {
    return createOutputObject(err);
  }

  if (count == 0) {
    return createOutputObject("no registered device");
  } else {
    return createOutputObject("Succeeded");
  }
}

/*
--------------------------------------------------------------------------------------------
  Definition of Extended Command

  1. Plug.toggle // Added 'toggle' command for Plug.
 */

function hookExCommand(deviceKey, param) {
  const deviceTypeMeta = DEVICE_META[deviceKey].deviceType;
  if (deviceTypeMeta === 'Plug') {
    if (param.command === 'toggle') {
      togglePlug(deviceKey);
      return true;
    }
  }
  return false;
}

function togglePlug(deviceKey) {
  const deviceId = DEVICE_TABLE[deviceKey];
  
  const command = {
    command: '',
    commandType: 'command',
    parameter: 'default',
  };

  const response1 = switchbotStatusGET(deviceId);
  if (200 == response1.getResponseCode()) {
    console.log('DEBUG : ' + deviceKey + ' : (Ex)toggle : fetch Status : ' + response1.getContentText());
    const status = JSON.parse(response1.getContentText());
    if (status.body.power.toLowerCase() === 'on') {
      command.command = 'turnOff';
    } else {
      command.command = 'turnOn';
    }
  } else {
    throw 'Failed : ' + deviceKey + ' : (Ex)toggle : fetch Status : ' + response1.getResponseCode();
  }

  const response2 = switchbotControlPOST(deviceId, command);
  if (200 != response2.getResponseCode()) {
    throw 'Failed : ' + deviceKey + ' : (Ex)toggle : post command : ' + response.getResponseCode();
  }
}

/*
--------------------------------------------------------------------------------------------
 */

function testDoGet001_deviceCount() {
  const e = {
    parameter:{
      // no parameter
    },
  };
  const ret = doGet(e);

  console.log('test result : ' + ret.getContent());
}

function testDoGet002_getDevice1() {
  const e = {
    parameter:{
      index: 1,
    },
  };
  const ret = doGet(e);

  console.log('test result : ' + ret.getContent());
}

class postData {
  constructor(data) {
    this.data = data;
  }
  getDataAsString() {
    return JSON.stringify(this.data, null, 2);
  }
}

function testDoPOST001_multipleDevice() {
  const e = {};
  e.postData = new postData({
    desk_light1: {
      command: 'turnOn',
      commandType: 'command',
      parameter: 'default',
    },
    owl_plug: {
      command: 'turnOn',
      commandType: 'command',
      parameter: 'default',
    },
  });
  const ret = doPost(e);

  console.log('test result : ' + ret.getContent());
}

function testDoPOST002_exCommand() {
  const e = {};
  e.postData = new postData({
    desk_light1: {
      command: 'toggle',
      commandType: 'command',
      parameter: 'default',
    },
    owl_plug: {
      command: 'toggle',
      commandType: 'command',
      parameter: 'default',
    },
  });
  const ret = doPost(e);

  console.log('test result : ' + ret.getContent());
}

function testDoPOST003_multipleCommand() {
  const e = {
    parameter:{
      desk_light1: [
        {
          command: 'toggle',
          commandType: 'command',
          parameter: 'default',
        },
        {
          command: 'toggle',
          commandType: 'command',
          parameter: 'default',
        },
      ],
    },
  };
  const ret = doPost(e);

  console.log('test result : ' + ret.getContent());
}






