#!/bin/bash

START_TIME="21:00"
END_TIME="8:00"

ewwScript="$HOME/.config/eww/scripts"

currentTime=$(date +%s)
startTime=$(date -d "$START_TIME" +%s)
endTime=$(date -d "$END_TIME" +%s)
if [ "$currentTime" -gt "$startTime" ] || [ "$currentTime" -lt "$endTime" ]; then
  pidof hyprsunset || $ewwScript/hyprsunsetToggle.sh
else
  echo "pidof hyprsunset || $ewwScript/hyprsunsetToggle.sh" | at $START_TIME
fi
