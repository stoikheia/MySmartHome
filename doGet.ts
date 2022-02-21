import { createOutputObject_ } from './apiCommon';
import { createErrorMessageWhenFetchSwitchbotAPI_ } from './switchbotCommon';
import { switchbotListGET_ } from './switchbotGET';

function outputDeviceCount_(): GoogleAppsScript.Content.TextOutput {
  const response = switchbotListGET_();
  if (200 === response.getResponseCode()) {
    const json = JSON.parse(response.getContentText());
    const deviceList = json.body.deviceList;
    return createOutputObject_('DeviceCount : ' + deviceList.length);
  } else {
    return createOutputObject_(createErrorMessageWhenFetchSwitchbotAPI_(response));
  }
}

function outputDeviceInfoByIndex_(i: number): GoogleAppsScript.Content.TextOutput {
  const response = switchbotListGET_();
  if (200 === response.getResponseCode()) {
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

function outputBareDeviceInfo_(): GoogleAppsScript.Content.TextOutput {
  const response = switchbotListGET_();
  if (200 === response.getResponseCode()) {
    return createOutputObject_('BareDeviceInfo : ' + response.getContentText());
  } else {
    return createOutputObject_(createErrorMessageWhenFetchSwitchbotAPI_(response));
  }
}

export { outputDeviceCount_, outputDeviceInfoByIndex_, outputBareDeviceInfo_ };
