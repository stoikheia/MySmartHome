function createOutputObject_(message: any): GoogleAppsScript.Content.TextOutput {
  console.log('createOutputObject : ' + message);
  return ContentService.createTextOutput(message);
}

export { createOutputObject_ };
