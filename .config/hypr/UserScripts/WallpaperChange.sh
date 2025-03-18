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
    swww img $1 $SWWW_PARAMS
  else
    echo "Image not found."
    exit 1
  fi
}

main $1

# killall -SIGUSR1 waybar
sleep 2
${SCRIPTSDIR}/PywalSwww.sh
sleep 0.1
${SCRIPTSDIR}/Refresh.sh
