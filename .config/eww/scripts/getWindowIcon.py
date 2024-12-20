#!/usr/bin/env python3

import json
import os
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk


def resolveIconPath(iconName):
    iconTheme = Gtk.IconTheme.get_default()
    iconFile = iconTheme.lookup_icon(iconName.lower(
    ),  32, 0)
    if iconFile:
        return iconFile.get_filename()
    else:
        return ""


def mapWindow(w):
    result = {
        "img": resolveIconPath(w["class"]),
        "workspace": w["workspace"]["name"],
        "title": w["title"],
        "pid": w["pid"]
    }
    return result


windows = json.loads(os.popen("hyprctl -j clients").read())
filtered_windows = list(filter(lambda w: w["workspace"]["id"] != -1, windows))
mapped_windows = list(map(mapWindow, filtered_windows))
print(json.dumps(mapped_windows), flush=True)
exit()
