import app from "ags/gtk4/app"
import Applauncher from "./widget/AppLauncher"
import WallpaperPicker from "./widget/WallpaperPicker"
import { exec } from "ags/process"
import { readFile } from "ags/file"
import QuickEdit from "./widget/QuickEdit"

exec("sass ./style.scss /tmp/style.css")

async function updateCSS() {
    exec("sass ./style.scss /tmp/style.css")
    const css = readFile("/tmp/style.css")
    App.apply_css(css, true)
    console.log("CLI | css reloaded")
}

app.start({
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
