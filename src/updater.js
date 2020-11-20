import Autoupdate from '@zagorodnyi/nw-autoupdater'
import img from './Img/logo.png'

export default async () => {
    const updater = new Autoupdate(require('../package.json'), {
        strategy: "CodeSwap",
    })

    try {
        const restart = async () => {
            await updater.restartToSwap();
        }
        let exit
        const update = async () => {
            updater.on("install", (installFiles, totalFiles) => { });
            updater.on("download", (downloadSize, totalSize) => { });
            const updateFile = await updater.download(rManifest, { debounceTime: 100 });
            await updater.unpack(updateFile, { debounceTime: 100 });

            const options = {
                type: "basic",
                iconUrl: img,
                title: "Ready to update",
                message: "This Application needs to quit to finish. Will quit in 15s.",
                buttons: [
                    {
                        title: "Stop Update"
                    },
                ]
            }
            chrome.notifications.create("readyToUpdate", options, callback)
            exit = setTimeout(() => {
                restart()
            }, 15000)
        }
        const callback = async (id, buttonIndex) => {
            if (id === "update" && buttonIndex === 0) {
                update()
            } else if (id === "readyToUpdate" && buttonIndex === 0) {
                clearTimeout(exit)
            }
        }

        ///// UPDATE BLOCK /////////////
        const rManifest = await updater.readRemoteManifest()
        const needsUpdate = await updater.checkNewVersion(rManifest);

        if (needsUpdate && chrome) {
            const options = {
                type: "basic",
                iconUrl: img,
                title: "New Update Available",
                message: "Do you want to update now? Press More ",
                buttons: [
                    {
                        title: "Yes"
                    },
                    {
                        title: "No"
                    }
                ]
            }

            chrome.notifications.onButtonClicked.addListener(callback)
            chrome.notifications.create("update", options, callback)
        }

    }
    catch (err) {
        console.log(err)
    }


}