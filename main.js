const { app, BrowserWindow } = require('electron');

let win;


function createWindow() {


  win = new BrowserWindow({
    width: 1000,
    height: 600,
    backgroundColor: '#ffffff',
    minWidth: 800,
    minHeight: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  win.setMenu(null);

  // win.loadURL(`file://${__dirname}/dist/mendozarq/index.html`);

  // Dev url
  win.loadURL('http://localhost:4200/');

  app.on('certificate-error', (event) => {
    event.preventDefault();
    callback(true);
  });

  // process.once('loaded', () => {
  //   global.ipcRenderer = electron.ipcRenderer;
  // });
  // Devtools


  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  });

}


// Create window  on electron intialization
app.on('ready', createWindow);

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {

  if (win === null) {
    createWindow();
  }
});



