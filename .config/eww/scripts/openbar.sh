#!/bin/bash


SCRIPT_DIR=$HOME/.config/eww/scripts

openwin(){
	eww update sysinfo_open=true wsopen=true
}

pkill -f $SCRIPT_DIR/closebar\.sh || openwin
$SCRIPT_DIR/closebar.sh &
