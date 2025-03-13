import { App } from "astal/gtk4"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Applauncher from "./widget/AppLauncher"
import WallpaperPicker from "./widget/WallpaperPicker"

App.start({
    css: style,
    main() {
        Applauncher()
        WallpaperPicker()
    },
})
