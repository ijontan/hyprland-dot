import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk4"
import { GLib, Variable } from "astal"
import Paginate from "./components/Paginate"

// config
const NAME = "launcher"
const COLUMNS = 4
const ROWS = 5
const HOME = GLib.getenv("HOME")
const PRIORITY_MAP_DIR_PATH = `${HOME}/.cache/ags`
const PRIORITY_MAP_PATH = `${PRIORITY_MAP_DIR_PATH}/app_priority_map.json`

function hide() {
    App.get_window(NAME)!.hide()
}

let appPriorityMap: Record<string, number> = {};
function updatePriorityMap(name: string) {
    if (appPriorityMap[name]) {
        appPriorityMap[name] += 1
    } else {
        appPriorityMap[name] = 1
    }
    const data = JSON.stringify(appPriorityMap, null, "\t")
    GLib.file_set_contents(PRIORITY_MAP_PATH, data)

}

function sortWithPriority(a: Apps.Application, b: Apps.Application): number {
    const aRank = appPriorityMap[a.name]
    const bRank = appPriorityMap[b.name]

    let ret = 0

    if (!aRank) ret = bRank
    else if (!bRank) ret = -aRank
    else if (aRank && bRank) ret = bRank - aRank

    if (ret === 0) ret = a.name.localeCompare(b.name)

    return ret
}


function AppButton({ app }: { app: Apps.Application }) {
    return <button
        cssClasses={["AppButton"]}
        canShrink
        onClicked={() => { hide(); app.launch(); updatePriorityMap(app.name) }}>
        <box vertical>
            <image iconName={app.iconName || "missing_symbolic"} />
            <label
                cssClasses={["name"]}
                ellipsize={3}
                label={app.name}
                maxWidthChars={15}
            />
        </box>
    </button>
}

export default function Applauncher() {
    const { CENTER } = Gtk.Align
    const apps = new Apps.Apps()

    let entry: Gtk.Entry;

    function setupEntry(widget: Gtk.Entry) {
        entry = widget;
    }

    const text = Variable("")
    let list = text(text => apps.fuzzy_query(text).sort(sortWithPriority))
    const onEnter = () => {
        const app = apps.fuzzy_query(text.get())?.sort(sortWithPriority)[0]
        app.launch()
        updatePriorityMap(app.name)
        hide()
    }

    return <window
        name={NAME}
        namespace={NAME}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        onShow={(_self) => {
            try {
                let [opened, contents] = GLib.file_get_contents(PRIORITY_MAP_PATH);
                if (opened) {
                    appPriorityMap = JSON.parse(contents.toString())
                }
            } catch (e) {
                appPriorityMap = {}
                console.log("not open")

                const data = JSON.stringify(appPriorityMap, null, "\t")
                GLib.mkdir(PRIORITY_MAP_DIR_PATH, 0b111101101);
                GLib.creat(PRIORITY_MAP_PATH, 0b110100100);
                GLib.file_set_contents(PRIORITY_MAP_PATH, data)
            }
            text.set(" ")
            text.set("")
            entry.text = ""
        }}
        onKeyPressed={(_self, keyval) => {
            if (keyval === Gdk.KEY_Escape) {
                hide()
            }
            if (keyval === Gdk.KEY_i || keyval === Gdk.KEY_f || keyval === Gdk.KEY_a) {
                entry.grab_focus()
            }
        }}
    >
        <box >
            <box hexpand />
            <box vertical>
                <box vexpand />
                <box widthRequest={1100} heightRequest={880} cssClasses={["Applauncher"]} vertical>
                    <entry
                        setup={setupEntry}
                        placeholderText="Search"
                        onFocusEnter={(self) => {
                            self.get_style_context().add_class("focus")
                        }}
                        onFocusLeave={(self) => {
                            self.get_style_context().remove_class("focus")
                        }}
                        onChanged={self => text.set(self.text)}
                        onActivate={onEnter}
                    />
                    <Paginate
                        columns={COLUMNS} rows={ROWS}
                        hspacing={20} vspacing={5}
                        datas={list} buildFunction={(app) => <AppButton app={app} />}
                    />
                    <box
                        halign={CENTER}
                        cssClasses={["not-found"]}
                        vertical
                        visible={list.as(l => l.length === 0)}>
                        <image iconName="system-search-symbolic" />
                        <label label="No match found" />
                    </box>
                </box>
                <box vexpand />
            </box>
            <box hexpand />
        </box>
    </window>
}
