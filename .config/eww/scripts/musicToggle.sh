#!/usr/bin/env bash

SCRIPT_DIR=$HOME/.config/eww/scripts

eww active-windows | grep music && $SCRIPT_DIR/musicClose.sh || $SCRIPT_DIR/musicOpen.sh
