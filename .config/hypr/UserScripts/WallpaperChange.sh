#!/bin/bash
## /* ---- 💫 https://github.com/JaKooLit 💫 ---- */  ##
# This script for selecting wallpapers (SUPER W)

SCRIPTSDIR="$HOME/.config/hypr/scripts"

# Transition config
FPS=60
TYPE="grow"
DURATION=2.5
BEZIER=".43,1.19,1,.4"
POS="$(bc -l <<< "scale=4 ; ${RANDOM}/32767"),$(bc -l <<< "scale=4 ; ${RANDOM}/32767")"
ANGLE="$(bc -l <<< "scale=3 ; ${RANDOM}/32767*360")"
SWWW_PARAMS="--transition-bezier $BEZIER --transition-fps $FPS --transition-type $TYPE --transition-pos $POS --transition-angle $ANGLE --transition-duration $DURATION --transition-wave 50,10"

echo $@
main() {

  if [[ $1 ]]; then
    magick "$1" -gravity West -crop 30%x100% /tmp/1
    magick "$1" -gravity East -crop 70%x100% /tmp/2
    swww img $1 $SWWW_PARAMS
    swww img /tmp/1 $SWWW_PARAMS -o DP-2
    swww img /tmp/1 $SWWW_PARAMS -o HDMI-A-1
    swww img /tmp/2 $SWWW_PARAMS -o eDP-1
    swww img /tmp/2 $SWWW_PARAMS -o eDP-2
  else
    echo "Image not found."
    exit 1
  fi
}

main $1

sleep 2
${SCRIPTSDIR}/PywalSwww.sh
sleep 0.1
${SCRIPTSDIR}/Refresh.sh
