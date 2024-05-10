#!/bin/bash

(( EUID != 0 )) && exec sudo -- "$0" "$@"

sudo pacman -Syu

declare -a packages=("git" "jq" "kitty" "thunar" 
"pipewire" "pipewire-pulse" "pavucontrol"
"rofi-wayland" "bc" "wlogout" "wofi" "wl-clipboard"
)
for package in "$packages"
do
	echo "Installing: " $package
	sudo pacman -S --needed --noconfirm $package
	echo "done: " $package
done
