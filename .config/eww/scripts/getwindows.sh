#!/usr/bin/env bash

scripts/getWindowIcon.py

socat -u UNIX-CONNECT:$XDG_RUNTIME_DIR/hypr/"$HYPRLAND_INSTANCE_SIGNATURE"/.socket2.sock - | while read -r event; do 
if [[ $event == *"window>>"* ]]; then
	scripts/getWindowIcon.py
fi
done
