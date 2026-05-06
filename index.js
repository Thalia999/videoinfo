const { enable } = require('@electron/remote/main');
const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const {app, BrowserWindow, ipcMain}= electron;
const remote = require('@electron/remote/main');
remote.initialize();

app.on('ready',()=>{
    console.log("App is ready");
    const mainWindow = new BrowserWindow({
        height: 800,
        width: 600,
        webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
    }
});
remote.enable(mainWindow.webContents);
mainWindow.loadURL(`file://${__dirname}/index.html`);
});
ipcMain.on('video:submit',(event, filepath)=>{
    console.log("Processing video information for file:", filepath);
    ffmpeg.ffprobe(filepath, (err, metadata) => {
        if (err) {
            console.error("FFprobe error:", err);
            event.reply("video:error", err);
            return;
        }
        if (!metadata || !metadata.format) {
            console.error("Metadata Error:", metadata);
            event.reply("video:error", "Invalid metadata");
            return;
        }
        const duration = metadata.format.duration;
        console.log("Duration:", duration);
        event.reply('video:durationAnalyzed', duration);
    });
});