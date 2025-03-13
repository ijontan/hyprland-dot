import { Binding, Variable } from "astal"
import { Gdk, Gtk } from "astal/gtk4"

interface PaginateProps<T> {
    columns: number
    rows: number
    initialPage?: number
    hspacing: number
    vspacing: number
    datas: Binding<T[]>
    buildFunction: (object: T) => Gtk.Widget

}
export default function Paginate<T>({
    columns, rows, initialPage = 0,
    hspacing, vspacing,
    datas, buildFunction,
}: PaginateProps<T>) {

    const currentPage = Variable(initialPage)
    const noOfItemInPage = columns * rows
    const lastPage = datas.as((datas) => (datas.length + noOfItemInPage - 1) / noOfItemInPage)

    return <box spacing={vspacing} vertical homogeneous
        onKeyPressed={(_self, keyval) => {
            const current = currentPage.get()

            console.log("KeyPress")
            if (keyval === Gdk.KEY_h && current > 0) currentPage.set(current - 1)
            if (keyval === Gdk.KEY_l && current < lastPage.get()) currentPage.set(current + 1)

        }}
    >
        {datas.as((datas) => {
            const ret: Gtk.Widget[] = []
            for (let i = 0; i < rows; i++) {
                const row: Gtk.Widget[] = [];
                for (let j = 0; j < columns; j++) {
                    const data = datas.at(currentPage.get() * noOfItemInPage + i * columns + j)
                    if (data)
                        row.push(buildFunction(data))
                    else
                        row.push(<box cssClasses={["empty"]} />)
                }
                ret.push(
                    <box spacing={hspacing} homogeneous>
                        {row}
                    </box >
                )
            }
            return ret
        })}
    </box>

}
