import { execAsync, GLib, Variable } from "astal"
import { App, Astal, Gdk, Gtk } from "astal/gtk4"
import { fuzzySearch } from "../utils/fuzzySearch"
import ScrollList from "./components/Paginate"


const NAME = "quickEdit"
const CROSS_AXIS_LENGTH = 2
const HOME = GLib.getenv("HOME")
const TERMINAL_COMMAND = "kitty -d"
const PATHS_MAP: Map<string, string> = new Map<string, string>([
    ["Hyprland", `${HOME}/.config/hypr`],
    ["Wlogout", `${HOME}/.config/wlogout/`],
    ["Eww", `${HOME}/.config/eww`],
    ["Swaync", `${HOME}/.config/swaync`],
    ["Kitty", `${HOME}/.config/kitty`],
    ["Wallust", `${HOME}/.config/wallust`],
    ["Rofi", `${HOME}/.config/rofi`],
    ["Neovim", `${HOME}/.config/nvim`],
    ["Ghostty", `${HOME}/.config/ghostty`],
    ["Ags", `${HOME}/.config/ags`],
    ["Keyd", "/etc/keyd"],
])

function hide() {
    App.get_window(NAME)!.hide()
}

function QuickEditButton({ item }: { item: string }) {
    return <button
        cssClasses={["WallpaperButton"]}
        canShrink
        onClicked={() => {
            hide()
            let path = PATHS_MAP.get(item);
            execAsync(`${TERMINAL_COMMAND} ${path} nvim ${path}`)
                .then((ret) => console.log("WALLPAPER | log: ", ret))
                .catch(() => console.log("WALLPAPER | failed to open file: ", path))
        }}
    >
        <label
            cssClasses={["name"]}
            ellipsize={3}
            label={item}
            maxWidthChars={15}
        />
    </button>
}

export default function QuickEdit() {
    const { CENTER } = Gtk.Align
    let entry: Gtk.Entry;

    function setupEntry(widget: Gtk.Entry) {
        entry = widget;
    }

    const text = Variable("")
    let list = text(text => [...PATHS_MAP.keys()].filter(item => fuzzySearch(text, item)))

    const onEnter = () => {
        let path = PATHS_MAP.get(list.get()[0]);
        execAsync(`${TERMINAL_COMMAND} ${path} nvim ${path}`)
            .then((ret) => console.log("WALLPAPER | log: ", ret))
            .catch(() => console.log("WALLPAPER | failed to open file: ", path))

        hide()
    }

    return <window
        name={NAME}
        namespace={NAME}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        onShow={() => {
            entry.text = ""
            text.set("")
        }}
        onKeyPressed={(_self, keyval) => {
            if (keyval == Gdk.KEY_Escape) {
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
                <box widthRequest={1100} heightRequest={880} cssClasses={["quickEdit"]} vertical>
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
                    <ScrollList
                        crossAxisLength={CROSS_AXIS_LENGTH}
                        width={1000} height={800}
                        hspacing={20} vspacing={5}
                        datas={list} buildFunction={(item) => <QuickEditButton item={item} />}
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
