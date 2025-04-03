import { execAsync, Gio, GLib, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import ScrollList from "./components/Paginate";
import { fuzzySearch } from "../utils/fuzzySearch";
import { Picture } from "./components/Picture";

// config
const NAME = "wallpaperPicker"
const CROSS_AXIS_LENGTH = 2
const HOME = GLib.getenv("HOME")
const WALLPAPER_PATH = `${HOME}/Pictures/wallpapers`
const CHANGE_WALLPAPER_COMMAND = `${HOME}/.config/hypr/UserScripts/WallpaperChange.sh`
const SUPPORTED_IMAGE_FORMAT: Record<string, boolean> = {
    png: true,
    PNG: true,
    jpg: true,
    JPG: true,
    jepg: true,
    JEPG: true,
    gif: true,
    GIF: true,
    SVG: true,
    svg: true,
}

function hide() {
    App.get_window(NAME)!.hide()
}

interface Wallpaper {
    name: string;
    path: string;
    file: Gio.File;
}

function WallpaperButton({ wallpaper }: { wallpaper: Wallpaper }) {
    return <button
        cssClasses={["WallpaperButton"]}
        canShrink
        onClicked={() => {
            hide()
            execAsync(`${CHANGE_WALLPAPER_COMMAND} ${wallpaper.path}`)
                .then((ret) => console.log("WALLPAPER | log: ", ret))
                .catch(() => console.log("WALLPAPER | failed to change wallpaper: ", wallpaper.path))
        }}
    >
        <box vertical>
            <Picture file={wallpaper.file} height_request={250} widthRequest={420} canShrink cssClasses={["image"]} />
            <label
                cssClasses={["name"]}
                ellipsize={3}
                label={wallpaper.name}
                maxWidthChars={15}
            />
        </box>
    </button>
}

export default function WallpaperPicker() {
    const wallpapers: Wallpaper[] = []
    const wallpaperDir = GLib.Dir.open(WALLPAPER_PATH, 0)
    for (let file = wallpaperDir.read_name(); file != null; file = wallpaperDir.read_name()) {
        const fileNameToken = file.split(".")
        const extension = fileNameToken[fileNameToken.length - 1]

        console.log("TEST | file: ", file)
        if (SUPPORTED_IMAGE_FORMAT[extension] == undefined) continue
        const path = `${WALLPAPER_PATH}/${file}`
        const wallpaper: Wallpaper = {
            name: fileNameToken[0],
            path: path,
            file: Gio.file_new_for_path(path)
        }
        wallpapers.push(wallpaper)
    }

    const text = Variable("")
    let filteredWallpapers = text(text => wallpapers.filter((wp) => fuzzySearch(text, wp.name) || text.length == 0))
    let entry: Gtk.Entry;

    function setupEntry(widget: Gtk.Entry) {
        entry = widget;
    }

    const onEnter = () => {
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
                <box cssClasses={["wallpaperPicker"]} vertical>
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
                        horizontal
                        width={1600} height={800}
                        hspacing={5} vspacing={5}
                        datas={filteredWallpapers} buildFunction={(wallpaper) => <WallpaperButton wallpaper={wallpaper} />}
                    />
                </box>
                <box vexpand />
            </box>
            <box hexpand />
        </box>
    </window>
}
