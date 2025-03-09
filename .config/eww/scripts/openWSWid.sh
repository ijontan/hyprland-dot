#!/bin/bash


SCRIPT_DIR=$HOME/.config/eww/scripts

Workspace(){
	CloseSpecial
	hyprctl dispatch workspace $1
}
MoveToWorkspace(){
	hyprctl dispatch movetoworkspace $1
}
MoveToWorkspaceSilent(){
	hyprctl dispatch movetoworkspacesilent $1
}
openwin(){
	eww update wsopen=true
}
CloseSpecial(){
	active=$(hyprctl -j monitors | jq --raw-output '.[] | select(.focused==true).specialWorkspace.name | split(":") | if length > 1 then .[1] else "" end')
	if [[ ${#active} -gt 0 ]]; then
    	hyprctl dispatch togglespecialworkspace "$active"
	fi
}

case "$1" in
	"ws")
		Workspace $2
		;;
	"movetows")
		MoveToWorkspace $2
		;;
	"movetowsSilent")
		MoveToWorkspaceSilent $2
		;;
esac
# main $1
pkill -f $SCRIPT_DIR/closeWSWid\.sh || openwin
$SCRIPT_DIR/closeWSWid.sh &
