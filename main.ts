import { createOutputObject_ } from './apiCommon';
import { outputDeviceCount_, outputDeviceInfoByIndex_, outputBareDeviceInfo_ } from './doGet';
import { outputSwitchbotControl_ } from './doPost';

function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  if (Object.keys(e.parameter).length === 0) {
    return outputDeviceCount_();
  }
  const param = e.parameter;
  if (param.index) {
    return outputDeviceInfoByIndex_(parseInt(param.index, 10));
  }
  if (param.bare && parseInt(param.bare, 10) !== 0) {
    return outputBareDeviceInfo_();
  }
  return createOutputObject_('Invalid Request');
}

function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  const params = JSON.parse(e.postData.contents) as { [key: string]: DeviceCommand.Base };
  const deviceKey = Object.keys(params);
  let count = 0;
  try {
    deviceKey.forEach((key) => {
      count++;
      const ret = outputSwitchbotControl_(key, params);
      console.log(ret.getContent());
    });
  } catch (err) {
    return createOutputObject_(err);
  }

  if (count === 0) {
    return createOutputObject_('no effected');
  } else {
    return createOutputObject_('Succeeded');
  }
}

/*
--------------------------------------------------------------------------------------------
 */

function testDoGet001_deviceCount() {
  const e = {
    parameter: {
      // no parameter
    },
  };
  const ret = doGet(e);

  console.log('test result : ' + ret.getContent());
}

function testDoGet002_getDevice1() {
  const e = {
    parameter: {
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
  // TODO: implementation
  const e = {
    parameter: {
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

