#!/bin/bash
# Rofi menu for Quick Edit / View of Settings (SUPER E)

configs="$HOME/.config/hypr/configs"
UserConfigs="$HOME/.config/hypr/UserConfigs"

declare -A menu_options=(
    ["Hyprland"]="$HOME/.config/hypr"
    ["Wlogout"]="$HOME/.config/wlogout/"
    ["Eww"]="$HOME/.config/eww"
    ["Swaync"]="$HOME/.config/swaync"
    ["Kitty"]="$HOME/.config/kitty"
    ["Wallust"]="$HOME/.config/wallust"
    ["Rofi"]="$HOME/.config/rofi"
    ["Neovim"]="$HOME/.config/nvim"
    ["Ghostty"]="$HOME/.config/ghostty"
    ["Ags"]="$HOME/.config/ags"
    ["Keyd"]="/etc/keyd"
)

main() {
  choice=$(printf "%s\n" "${!menu_options[@]}" | rofi -i -term=kitty -config ~/.config/rofi/config-compact.rasi -dmenu | cut -d. -f1)

  if [ -z "$choice" ]; then
    exit 1
  fi
  
  path="${menu_options[$choice]}"
  kitty -d $path nvim $path
}

pkill rofi || main
