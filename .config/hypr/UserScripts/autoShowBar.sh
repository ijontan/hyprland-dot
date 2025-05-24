#!/usr/bin/env bash

doWhenEmpty() {
    echo empty
}

doWhenNotEmpty() {
    echo notempty
}

checkEmpty() {
  numberOfWindowOnActive=$(hyprctl activeworkspace -j | jq '.windows')
  if (( $numberOfWindowOnActive == 0 )); then 
    doWhenEmpty
  else 
    doWhenNotEmpty
  fi
}

socat -u UNIX-CONNECT:$XDG_RUNTIME_DIR/hypr/"$HYPRLAND_INSTANCE_SIGNATURE"/.socket2.sock - | while read -r event; do 
if [[ $event == *"openwindow>>"* ]] || [[ $event == *"closewindow>>"* ]] || [[ $event == *"movewindow>>"* ]] || [[ $event == "workspace>>"* ]]; then
  checkEmpty
fi
done
