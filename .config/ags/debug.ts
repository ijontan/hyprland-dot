
import { App } from "astal/gtk4"
import Applauncher from "./widget/AppLauncher"
import WallpaperPicker from "./widget/WallpaperPicker"
import { exec, readFile } from "astal"
import QuickEdit from "./widget/QuickEdit"

exec("sass ./style.scss /tmp/style.css")

async function updateCSS() {
    exec("sass ./style.scss /tmp/style.css")
    const css = readFile("/tmp/style.css")
    App.apply_css(css, true)
    console.log("CLI | css reloaded")
}

App.start({
    instanceName: "debug",
    css: "/tmp/style.css",
    main() {
        Applauncher()
        WallpaperPicker()
        QuickEdit()
    },
    requestHandler(request: string, res: (respond: any) => void) {
        if (request == "reload") {
            updateCSS()
            return res("reloaded")
        }
    }
})
