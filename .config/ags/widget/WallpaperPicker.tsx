import { Binding, exec, execAsync, Gio, GLib, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import ScrollList from "./components/Paginate";
import { fuzzySearch } from "../utils/fuzzySearch";
import { Picture } from "./components/Picture";

// config
const NAME = "wallpaperPicker"
const CROSS_AXIS_LENGTH = 2
const HOME = GLib.getenv("HOME")
const WALLPAPER_PATH = `${HOME}/Pictures/wallpapers`
const CACHE_PATH = `/tmp/wallpapers`
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
    cachePath: string;
    file?: Gio.File;
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

async function wallpapersSetup(wallpaperDir: GLib.Dir): Promise<Wallpaper[]> {
    const wallpapers: Wallpaper[] = []
    for (let file = wallpaperDir.read_name(); file != null; file = wallpaperDir.read_name()) {
        const fileNameToken = file.split(".")
        const extension = fileNameToken[fileNameToken.length - 1]

        console.log("TEST | file: ", file)
        if (SUPPORTED_IMAGE_FORMAT[extension] == undefined) continue

        const wallpaper: Wallpaper = {
            name: fileNameToken[0],
            path: `${WALLPAPER_PATH}/${file}`,
            cachePath: `${CACHE_PATH}/${file}`,
        }
        wallpapers.push(wallpaper)
    }

    try {
        exec(`mkdir ${CACHE_PATH}`)
    } catch (e) { }
    await Promise.all(wallpapers.map((wallpaper) => execAsync(`magick ${wallpaper.path} -resize 20% ${wallpaper.cachePath}`)))
    for (let wallpaper of wallpapers)
        wallpaper.file = Gio.file_new_for_path(wallpaper.cachePath)

    return wallpapers
}


export default function WallpaperPicker() {
    const wallpaperDir = GLib.Dir.open(WALLPAPER_PATH, 0)
    const wallpapers = Variable<Wallpaper[]>([]);
    wallpapersSetup(wallpaperDir).then(newWallpapers => wallpapers.set(newWallpapers))

    const text = Variable("")
    let filteredWallpapers = Variable.derive(
        [text, wallpapers],
        (text: string, wallpapers: Wallpaper[]) => wallpapers.filter((wp) => fuzzySearch(text, wp.name) || text.length == 0)
    )
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
                        datas={filteredWallpapers()} buildFunction={(wallpaper) => <WallpaperButton wallpaper={wallpaper} />}
                    />
                </box>
                <box vexpand />
            </box>
            <box hexpand />
        </box>
    </window>
}
