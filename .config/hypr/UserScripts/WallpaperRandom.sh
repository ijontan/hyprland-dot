#!/bin/bash
## /* ---- 💫 https://github.com/JaKooLit 💫 ---- */  ##
# Script for Random Wallpaper ( CTRL ALT W)

wallDIR="$HOME/Pictures/wallpapers"
SCRIPTSDIR="$HOME/.config/hypr/scripts"
USERSCRIPTSDIR="$HOME/.config/hypr/UserScripts"

PICS=($(find ${wallDIR} -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" \)))
RANDOMPICS=${PICS[ $RANDOM % ${#PICS[@]} ]}

rm -rf ~/.cache/swww/*
swww query || hyprctl dispatch exec swww-daemon -q
sleep 0.1
swww img -t none ~/Pictures/black_wallpaper.png && ${USERSCRIPTSDIR}/WallpaperChange.sh ${RANDOMPICS}


sleep 2
${SCRIPTSDIR}/PywalSwww.sh
sleep 0.1
${SCRIPTSDIR}/Refresh.sh
