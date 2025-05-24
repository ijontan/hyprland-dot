import { Binding } from "astal"
import { Gtk } from "astal/gtk4"
import { ScrolledWindow } from "./ScrolledWindow"

interface ScrollistProps<T> {
    crossAxisLength: number,
    horizontal?: boolean,
    hspacing: number
    vspacing: number
    width: number
    height: number
    datas: Binding<T[]>
    buildFunction: (object: T) => Gtk.Widget

}
export default function ScrollList<T>({
    crossAxisLength, horizontal = false,
    hspacing, vspacing,
    width, height,
    datas, buildFunction,
}: ScrollistProps<T>) {
    return <ScrolledWindow hscrollbarPolicy={horizontal ? Gtk.PolicyType.ALWAYS : Gtk.PolicyType.NEVER}
        vscrollbarPolicy={horizontal ? Gtk.PolicyType.NEVER : Gtk.PolicyType.ALWAYS}
        heightRequest={height} widthRequest={width}>
        <box spacing={vspacing} vertical homogeneous={horizontal}>
            {datas.as((datas) => {
                const ret: Gtk.Widget[] = []
                const htotal = !horizontal ? datas.length / crossAxisLength + 1 : crossAxisLength;
                const vtotal = horizontal ? datas.length / crossAxisLength + 1 : crossAxisLength;
                for (let i = 0; i < htotal; i++) {
                    const row: Gtk.Widget[] = [];
                    for (let j = 0; j < vtotal; j++) {
                        const data = datas.at(i * crossAxisLength + j)
                        if (data)
                            row.push(buildFunction(data))
                        else
                            row.push(<box cssClasses={["empty"]} />)
                    }
                    ret.push(
                        <box spacing={hspacing} homogeneous={!horizontal}>
                            {row}
                        </box >
                    )
                }
                return ret
            })}
        </box>
    </ScrolledWindow>

}
