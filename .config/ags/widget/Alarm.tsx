import { App, Astal } from "astal/gtk4"

const NAME = "alarm"
export default function Alarm() {
    return <window
        name={NAME}
        namespace={NAME}
        anchor={Astal.WindowAnchor.LEFT | Astal.WindowAnchor.TOP}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
    >
    </window>
}
