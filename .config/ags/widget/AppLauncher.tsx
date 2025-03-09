import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk4"
import { GLib, Variable } from "astal"

const MAX_ITEMS = 10

function hide() {
    App.get_window("launcher")!.hide()
}

function AppButton({ app }: { app: Apps.Application }) {
    return <button
        cssClasses={["AppButton"]}
        onClicked={() => { hide(); app.launch() }}>
        <box>
            <image iconName={app.iconName || "missing_symbolic"} />
            <box valign={Gtk.Align.CENTER} vertical>
                <label
                    cssClasses={["name"]}
                    ellipsize={3}
                    xalign={0}
                    label={app.name}
                />
                {app.description ? <label
                    cssClasses={["description"]}
                    ellipsize={3}
                    wrap
                    xalign={0}
                    label={app.description}
                /> : <box />}
            </box>
        </box>
    </button>
}

export default function Applauncher() {
    const { CENTER } = Gtk.Align
    const apps = new Apps.Apps()
    const width = Variable(1000)

    const text = Variable("")
    const list = text(text => apps.fuzzy_query(text).slice(0, MAX_ITEMS))
    const onEnter = () => {
        apps.fuzzy_query(text.get())?.[0].launch()
        hide()
    }

    return <window
        name="launcher"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        onShow={(self) => {
            text.set("")
            width.set(1000)
        }}
    >
        <box hexpand={false} vertical>
            <box heightRequest={200} />
            <box widthRequest={500} cssClasses={["Applauncher"]} vertical>
                <entry
                    placeholderText="Search"
                    onChanged={self => text.set(self.text)}
                    onActivate={onEnter}
                    onKeyPressed={(self, keyval) => {
                        if (keyval === Gdk.KEY_Escape) {
                            hide()
                        }
                    }}
                />
                <box spacing={6} vertical>
                    {list.as(list => list.map(app => (
                        <AppButton app={app} />
                    )))}
                </box>
                <box
                    halign={CENTER}
                    cssClasses={["not-found"]}
                    vertical
                    visible={list.as(l => l.length === 0)}>
                    <image iconName="system-search-symbolic" />
                    <label label="No match found" />
                </box>
                <box hexpand />
            </box>
            <box hexpand />
        </box>
    </window>
}
