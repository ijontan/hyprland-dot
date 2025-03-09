import { App } from "astal/gtk4"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Applauncher from "./widget/AppLauncher"

App.start({
    css: style,
    main() {
        Applauncher()
    },
})
