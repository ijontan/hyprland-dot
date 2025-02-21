#!/bin/bash
## /* ---- 💫 https://github.com/JaKooLit 💫 ---- */  ##
# Script for Random Wallpaper ( CTRL ALT W)

wallDIR="$HOME/Pictures/wallpapers"
SCRIPTSDIR="$HOME/.config/hypr/scripts"

PICS=($(find ${wallDIR} -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" \)))
RANDOMPICS=${PICS[ $RANDOM % ${#PICS[@]} ]}


# Transition config
FPS=60
TYPE="grow"
DURATION=2.5
BEZIER=".43,1.19,1,.4"
POS="$(bc -l <<< "scale=4 ; ${RANDOM}/32767"),$(bc -l <<< "scale=4 ; ${RANDOM}/32767")"
ANGLE="$(bc -l <<< "scale=3 ; ${RANDOM}/32767*360")"
SWWW_PARAMS="--transition-bezier $BEZIER --transition-fps $FPS --transition-type $TYPE --transition-pos $POS --transition-angle $ANGLE --transition-duration $DURATION --transition-wave 50,10"

rm -rf ~/.cache/swww/*
swww query || swww init && swww img -t none ~/Pictures/black_wallpaper.png && swww img ${RANDOMPICS} $SWWW_PARAMS


sleep 2
${SCRIPTSDIR}/PywalSwww.sh
sleep 0.1
${SCRIPTSDIR}/Refresh.sh
