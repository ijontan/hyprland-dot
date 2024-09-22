#!/bin/bash

(( EUID != 0 )) && exec sudo -- "$0" "$@"
SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# sudo pacman -Syu

install_pacman(){
	sudo pacman -S --needed --noconfirm - < "$SCRIPT_PATH/pkglist.txt"
}

install_yay(){
	sudo pacman -S --needed --noconfirm base-devel
	git clone https://aur.archlinux.org/yay-bin.git /tmp/buildyay
	cd /tmp/buildyay
	makepkg -o
	makepkg -se
	makepkg -i --noconfirm
	cd $base
	rm -rf /tmp/buildyay
}

install_aur(){
	yay -S --needed --noconfirm - < "$SCRIPT_PATH/pkglist_foreign.txt"
}

install_pacman
install_yay
install_aur
