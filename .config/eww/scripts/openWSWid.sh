#!/bin/bash


SCRIPT_DIR=$HOME/.config/eww/scripts

main(){
	hyprctl dispatch workspace $1
}
openwin(){
	eww update wsopen=true
}

main $1
pkill -f $SCRIPT_DIR/closeWSWid\.sh || openwin
$SCRIPT_DIR/closeWSWid.sh &
