#!/usr/bin/env python3

import json
import os
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk

home = os.environ["HOME"]
iconMap = {
    "com.mitchellh.ghostty": home + "/Pictures/icons/ghostty.png",
    "zen": home + "/Pictures/icons/Zen.svg"
}

def resolveIconPath(iconName):
    if iconName == "com.mitchellh.ghostty":
        iconName ="terminal"
    if iconName in iconMap:
        return iconMap[iconName]
    iconTheme = Gtk.IconTheme.get_default()
    iconFile = iconTheme.lookup_icon(iconName.lower(
    ),  32, 0)
    if iconFile:
        return iconFile.get_filename()
    else:
        return ""


def mapWindow(w):
    result = {
        "address": w["address"],
        "img": resolveIconPath(w["class"]),
        "title": w["title"],
        "pid": w["pid"],
        "focusHistoryID": w["focusHistoryID"]
    }
    return result


windows = json.loads(os.popen("hyprctl -j clients").read())
filtered_windows = list(filter(lambda w: w["workspace"]["id"] != -1, windows))
ret = []
for window in filtered_windows:
    workspaceName = window["workspace"]["name"]
    splitted = workspaceName.split(':', 1)
    workspaceName = splitted[-1]
    found = False
    for group in ret:
        if group["workspace"] == workspaceName:
            group["windows"].append(mapWindow(window))
            found = True
    if not found:
        ret.append({"workspace": workspaceName, "windows": [mapWindow(window)]})

print(json.dumps(sorted(ret, key=lambda x: x["workspace"])))
# mapped_windows = list(map(mapWindow, filtered_windows))
# print(json.dumps(mapped_windows), flush=True)
exit()
