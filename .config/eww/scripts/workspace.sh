#!/bin/bash

#define icons for workspaces 1-9
ic=(0 I II III IV V VI VII VIII IX X)

workspaces() {
  if !([[ $1 == "workspace>>"* ]] || [[ $1 == "focusedmon>>"* ]] || [ $# -eq 0 ]);  then
    return 1
  fi
unset -v \
  o1 o2 o3 o4 o5 o6 o7 o8 o9 o10 \
  f1 f2 f3 f4 f5 f6 f7 f8 f9 f10
ows="$(hyprctl workspaces -j | jq '.[] | del(select(.id == -99)) | .id' | sort)"

for num in $ows; do
  export o"$num"="$num"
done

# Get Focused workspace for current monitor ID
arg=0
# num="$(hyprctl monitors -j | jq --argjson arg "$arg" '.[] | select(.id == $arg).activeWorkspace.id')"
# export f"$num"="$num"
num=$(hyprctl activeworkspace -j |  jq '.id')

export f"$num"="$num"
#output eww widget
output="(eventbox :onscroll \"echo {} | sed -e 's/up/-1/g' -e 's/down/+1/g' | xargs hyprctl dispatch workspace\""
output=$output"  (box	:class \"works\"	:orientation \"h\" :spacing 5 :space-evenly \"true\""

for num in ${!ic[@]}; do
  if [[ "$num" == '0' ]]; then
    continue
  fi
  open="o$num"
  focus="f$num"
  icon=${ic[$num]}
  output=$output"    (button :onclick \"hyprctl dispatch workspace $num\" :class \"w0${!open}${!focus}\" \"$icon\")"
done
output=$output"  )"
output=$output")"
echo $output
}

workspaces

socat -u UNIX-CONNECT:$XDG_RUNTIME_DIR/hypr/"$HYPRLAND_INSTANCE_SIGNATURE"/.socket2.sock - | while read -r event; do 
workspaces "$event"
done
