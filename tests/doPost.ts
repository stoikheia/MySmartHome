import { doPost } from '../doPost';

class PostData {
  contents: {};
  constructor(contents: {}) {
    this.contents = JSON.stringify(contents, null, 2);
  }
}

function testDoPOST001_multipleDevice() {
  const e: { postData: PostData } = {
    postData: new PostData({
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
    }),
  };
  const ret = doPost(e);

  console.log('test result : ' + ret.getContent());
}

function testDoPOST002_exCommand() {
  const e = {
    postData: new PostData({
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
    }),
  };
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

export { testDoPOST001_multipleDevice, testDoPOST002_exCommand, testDoPOST003_multipleCommand };
