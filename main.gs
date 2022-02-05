var SECRET_DEVELOPER_TOKEN = PropertiesService.getScriptProperties().getProperty("SECRET_DEVELOPER_TOKEN");

var HOST = "https://api.switch-bot.com";
var DEVICE_LIST_PATH = "/v1.0/devices";
var DEVICE_CONTROL_PATH = "/v1.0/devices/{deviceId}/commands"

var DESK_LIGHT1_ID = PropertiesService.getScriptProperties().getProperty("DESK_LIGHT1_ID");
var OWL_PLUG_ID = PropertiesService.getScriptProperties().getProperty("OWL_PLUG_ID");

var DEVICE_TABLE = {
  desk_light1 : DESK_LIGHT1_ID,
  owl_plug : OWL_PLUG_ID,
};

function createDeviceControlPath(deviceId) {
  return DEVICE_CONTROL_PATH.replace('{deviceId}', deviceId);
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

function createErrorMessageWhenFetchSwitchbotAPI(response) {
  return 'Fetch SwitchbotAPI Failed : ' + response.getResponseCode() + ' ' + response.getContentText();
}

function createOutputObject(message) {
  console.log('createOutputObject : ' + message);
  return ContentService.createTextOutput(message);
}

function outputDeviceCount() {
  var response = switchbotListGET();
  if (200 == response.getResponseCode()) {
    var json = JSON.parse(response.getContentText());
    var deviceList = json.body.deviceList;
    return createOutputObject('DeviceCount : ' + deviceList.length);
  } else {
    return createOutputObject(createErrorMessageWhenFetchSwitchbotAPI(response));
  }
}

function outputDeviceInfoByIndex(i) {
  var response = switchbotListGET();
  if (200 == response.getResponseCode()) {
    var json = JSON.parse(response.getContentText());
    var deviceList = json.body.deviceList;
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
  var response = switchbotListGET();
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
  var param = e.parameter;
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
  if (params.debug) {
        var response = switchbotControlPOST(DEVICE_TABLE[key], params[key]);
    if (200 == response.getResponseCode()) {
      return ContentService.createTextOutput('Succeeded : ' + key);
    } else {
      return ContentService.createTextOutput('Failed : ' + key + ' : ' + response.getResponseCode());
    }
  }
}

function doPost(e) {
  var params = JSON.parse(e.postData.getDataAsString());
  var keys = Object.keys(params);
  try {
    keys.forEach(key => {
      if (DEVICE_TABLE[key]) {
        return outputSwitchbotControl(key, params)
      } else {
        throw 'Error : ' + key + ' not found';
      }
    });
  } catch (e) {
    return ContentService.createTextOutput(e);
  }
  var desk_light1 = params.desk_light1;

  if (desk_light1) {
    var response = switchbotControlPOST(DESK_LIGHT1_ID, desk_light1);
    if (200 == response.getResponseCode()) {
      return ContentService.createTextOutput('Succeeded : desk_light1');
    } else {
      return ContentService.createTextOutput('Failed : ' + response.getResponseCode());
    }
    Logger.log(JSON.stringify(desk_light1));
    return ContentService.createTextOutput(JSON.stringify(desk_light1));
  } else {
    return ContentService.createTextOutput("no function");
  }
  return ContentService.createTextOutput("succeeded");
}

