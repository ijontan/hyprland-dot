#!/usr/bin/env bash

sDIR="$HOME/.config/hypr/UserScripts"
SCRIPT_DIR=$HOME/.config/eww/scripts

volume() {
    pamixer --get-volume
}

icon() {
    val="$(pamixer --get-volume)"
    mute="$(pamixer --get-mute)"

    if [[ "$mute" == "true" ]]; then
        echo "󰝟 "
    elif (( val == 0 )); then
        echo " "
    elif (( val < 50 )); then
        echo " "
    else 
        echo " "
    fi
}

main() {
    if [[ "$1" == "--volume" ]]; then
        volume
    elif [[ "$1" == "--icon" ]]; then
        icon
    fi
}

main "$@"
if [[ "$2" == "--listen" ]]; then
    pactl  subscribe | grep --line-buffered "change.*sink" | while read -r event ; do main "$1"; done
fi
