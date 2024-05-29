#!/bin/bash

(( EUID != 0 )) && exec sudo -- "$0" "$@"

sudo pacman -Syu

install_pacman(){
	packages="git jq bc kitty 
	thunar thunar-archive-plugin
	socat
	pipewire pipewire-pulse pipewire-alsa pavucontrol pamixer
	rofi-wayland wofi wl-clipboard
	mpv yt-dlp brightnessctl cliphist playerctl polkit grim slurp swappy
	acpi
	sddm npm"

	sudo pacman -S --needed --noconfirm $packages
}

install_yay(){
	git clone https://aur.archlinux.org/yay.git
	cd yay
	makepkg -si --needed --noconfirm
}

install_aur(){
	aur="hyprland-git cava wlogout swww-git oh-my-posh eww-git delta pywal-git"	
	yay -S --needed --noconfirm
}

install_pacman
install_yay
install_aur
