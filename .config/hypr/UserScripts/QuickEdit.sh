#!/bin/bash
# Rofi menu for Quick Edit / View of Settings (SUPER E)

configs="$HOME/.config/hypr/configs"
UserConfigs="$HOME/.config/hypr/UserConfigs"

declare -A menu_options=(
    ["Hyprland"]="$HOME/.config/hypr"
    ["Eww"]="$HOME/.config/eww"
    ["Swaync"]="$HOME/.config/swaync"
    ["Kitty"]="$HOME/.config/kitty"
    ["Pywal"]="$HOME/.config/wal"
    ["Rofi"]="$HOME/.config/rofi"
    ["Keyd"]="/etc/keyd"
)

main() {
  choice=$(printf "%s\n" "${!menu_options[@]}" | wofi --term=kitty --dmenu | cut -d. -f1)

  if [ -z "$choice" ]; then
    exit 1
  fi
  
  path="${menu_options[$choice]}"
  kitty -d $path nvim $path
}

main
