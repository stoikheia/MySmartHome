import { doGet } from './doGet';
import { doPost } from './doPost';

declare const global: {
  [x: string]: unknown;
};

global.doGet = doGet;
global.doPost = doPost;

/*
--------------------------------------------------------------------------------------------
 */

import { testDoGet001_deviceCount, testDoGet002_getDevice1 } from './tests/doGet';

global.testDoGet001_deviceCount = testDoGet001_deviceCount;
global.testDoGet002_getDevice1 = testDoGet002_getDevice1;

import { testDoPOST001_multipleDevice, testDoPOST002_exCommand, testDoPOST003_multipleCommand } from './tests/doPost';

global.testDoPOST001_multipleDevice = testDoPOST001_multipleDevice;
global.testDoPOST002_exCommand = testDoPOST002_exCommand;
global.testDoPOST003_multipleCommand = testDoPOST003_multipleCommand;
