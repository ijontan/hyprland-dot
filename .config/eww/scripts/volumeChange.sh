#!/usr/bin/env bash

sDIR="$HOME/.config/hypr/UserScripts"

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

volume() {
    pamixer --get-volume
}

notify_user() {
    if [[ "$(get_volume)" == "Muted" ]]; then
        notify-send -e -h string:x-canonical-private-synchronous:volume_notif -u low -i "$(icon)" "Volume: Muted"
    else
        notify-send -e -h int:value:"$(volume | sed 's/%//')" -h string:x-canonical-private-synchronous:volume_notif -u low -i "$(icon)" "Volume: $(volume)"
        "$sDIR/Sounds.sh" --volume
    fi
}

change_volume() {
    if [[ `pgrep -f $0` != "$$" ]]; then
        exit
    fi
    if [[ "$1" == "down" ]]; then
        pamixer -i 5 && notify_user
    elif [[ "$1" == "up" ]]; then
        pamixer -d 5 && notify_user
    fi
}

change_volume "$@"
