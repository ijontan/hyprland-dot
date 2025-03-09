#!/bin/bash

on-lid() {
    hyprctl keyword monitor "HDMI-A-1, disabled"
    sleep 0.5
    hyprctl reload
}

off-lid() {
    hyprctl keyword monitor "eDP-1, disabled"
    hyprctl keyword monitor "eDP-2, disabled"
}

main() {
    eww close-all
    sleep 0.5
    if [[ "$1" == "on" ]]; then
        on-lid
    elif [[ "$1" == "off" ]]; then
        off-lid
    fi
    sleep 0.5
    eww open-many wswid sysinfo windows
}

no_of_monitor=$(hyprctl monitors -j | jq length)
if [[ "$no_of_monitor" == "1" ]]; then
    systemctl suspend
else
    main "$@"
fi
