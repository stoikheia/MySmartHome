import { doGet } from '../doGet';

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

export { testDoGet001_deviceCount, testDoGet002_getDevice1 };
