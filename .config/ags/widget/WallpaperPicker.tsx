import { GLib, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";

// config
const NAME = "wallpaperPicker"
const COLUMNS = 4
const ROW = 2
const HOME = GLib.getenv("HOME")
const WALLPAPER_PATH = `${HOME}/Pictures/wallpapers`

function hide() {
    App.get_window(NAME)!.hide()
}

interface Wallpaper {
    name: string;
    path: string;
}

function WallpaperButton({ wallpaper }: { wallpaper: Wallpaper }) {
    return <button
        cssClasses={["WallpaperButton"]}
        canShrink
    >
        <box vertical>
            <image file={wallpaper.path} />
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
    const wallpapers = Variable<Wallpaper[]>([])
    const wallpaperDir = GLib.Dir.open(WALLPAPER_PATH, 0)
    const tmp_wallpaper: Wallpaper[] = []
    for (let file = wallpaperDir.read_name(); file != null; file = wallpaperDir.read_name()) {
        const wallpaper: Wallpaper = {
            name: file,
            path: `${WALLPAPER_PATH}/${file}`
        }
        console.log("TEST | file: ", file)
        tmp_wallpaper.push(wallpaper)
    }
    wallpapers.set(tmp_wallpaper)

    const text = Variable("")
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
        onKeyPressed={(_self, keyval) => {
            if (keyval == Gdk.KEY_Escape) {
                hide()
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
                    <box spacing={5} vertical homogeneous>
                        {wallpapers((wallpapers) => {
                            const ret: Gtk.Widget[] = []
                            for (let i = 0; i < ROW; i++) {
                                const row: Gtk.Widget[] = [];
                                for (let j = 0; j < COLUMNS; j++) {
                                    const wallpaper = wallpapers.at(i * COLUMNS + j)
                                    if (wallpaper)
                                        row.push(<WallpaperButton wallpaper={wallpaper} />)
                                    else
                                        row.push(<box cssClasses={["empty"]} />)
                                }
                                ret.push(
                                    <box spacing={20} homogeneous>
                                        {row}
                                    </box >
                                )
                            }
                            return ret
                        })}
                    </box>
                </box>
                <box vexpand />
            </box>
            <box hexpand />
        </box>
    </window>
}
