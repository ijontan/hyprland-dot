#!/bin/bash


SCRIPT_DIR=$HOME/.config/eww/scripts

main(){
	hyprctl dispatch workspace $1
}
Workspace(){
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
