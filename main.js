
function createOutputObject_(message) {
  console.log('createOutputObject : ' + message);
  return ContentService.createTextOutput(message);
}

function outputDeviceCount_() {
  const response = switchbotListGET_();
  if (200 == response.getResponseCode()) {
    const json = JSON.parse(response.getContentText());
    const deviceList = json.body.deviceList;
    return createOutputObject_('DeviceCount : ' + deviceList.length);
  } else {
    return createOutputObject_(createErrorMessageWhenFetchSwitchbotAPI_(response));
  }
}

function outputDeviceInfoByIndex_(i) {
  const response = switchbotListGET_();
  if (200 == response.getResponseCode()) {
    const json = JSON.parse(response.getContentText());
    const deviceList = json.body.deviceList;
    if (i < deviceList.length) {
      return createOutputObject_('Device' + i + ' : ' + JSON.stringify(deviceList[i], null, 2));
    } else {
      return createOutputObject_('Invalid Argument : DeviceInfo OutOfIndex ' + i + '<' + deviceList.length);
    }
  } else {
    return createOutputObject_(createErrorMessageWhenFetchSwitchbotAPI_(response));
  }
}

function outputBareDeviceInfo_() {
  const response = switchbotListGET_();
  if (200 == response.getResponseCode()) {
    return createOutputObject_('BareDeviceInfo : ' + response.getContentText());
  } else {
    return createOutputObject_(createErrorMessageWhenFetchSwitchbotAPI_(response));
  }
}

function doGet(e) {
  if (Object.keys(e.parameter).length === 0) {
    return outputDeviceCount_();
  }
  const param = e.parameter;
  if (param.index) {
    return outputDeviceInfoByIndex_(param.index);
  }
  if (param.bare && Integer.parse(param.bare) !== 0) {
    return outputBareDeviceInfo_();
  }
  return createOutputObject_('Invalid Request');
}


function switchbotControlPOST_(deviceId, json) {
    return UrlFetchApp.fetch(HOST + createDeviceControlPath_(deviceId), {
      'method': 'POST',
      'headers' : {
        'authorization': SECRET_DEVELOPER_TOKEN,
        'content-type': 'application/json',
      },
      'payload': JSON.stringify(json, null, null),
      'muteHttpExceptions': true,
    });
}

function outputSwitchbotControl_(key, params) {
  if (hookExCommand_(key, params[key])) {
    return createOutputObject_('Succeeded : ' + key + ' : (Ex)' + params[key].command);
  } else {
    const response = switchbotControlPOST_(DEVICE_TABLE[key], params[key]);
    if (200 == response.getResponseCode()) {
      return createOutputObject_('Succeeded : ' + key + ' : ' + params[key].command);
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
        const ret = outputSwitchbotControl_(key, params);
        console.log(ret.getContent());
      } else {
        throw 'Error : ' + key + ' not found';
      }
    });
  } catch (err) {
    return createOutputObject_(err);
  }

  if (count == 0) {
    return createOutputObject_("no registered device");
  } else {
    return createOutputObject_("Succeeded");
  }
}

/*
--------------------------------------------------------------------------------------------
  Definition of Extended Command

  1. Plug.toggle // Added 'toggle' command for Plug.
 */

function hookExCommand_(deviceKey, param) {
  const deviceTypeMeta = DEVICE_META[deviceKey].deviceType;
  if (deviceTypeMeta === 'Plug') {
    if (param.command === 'toggle') {
      togglePlug_(deviceKey);
      return true;
    }
  }
  return false;
}

function togglePlug_(deviceKey) {
  const deviceId = DEVICE_TABLE[deviceKey];
  
  const command = {
    command: '',
    commandType: 'command',
    parameter: 'default',
  };

  const response1 = switchbotStatusGET_(deviceId);
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

  const response2 = switchbotControlPOST_(deviceId, command);
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

function testDoPOST003_multipleCommand() { // TODO: implementation
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






