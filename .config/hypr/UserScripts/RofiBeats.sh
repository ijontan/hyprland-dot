#!/bin/bash

# Directory for icons
iDIR="$HOME/.config/swaync/icons"

# Note: You can add more options below with the following format:
# ["TITLE"]="link"

# Define menu options as an associative array
declare -A menu_options=(
  ["ANIME Music 🔥🎶"]="https://youtube.com/playlist?list=PLq8kPn_CxA2guzA85tLCTAQcb-1UQZIwa"
  ["Lofi Girl ☕️🎶"]="https://play.streamafrica.net/lofiradio"
  ["96.3 Easy Rock 📻🎶"]="https://radio-stations-philippines.com/easy-rock"
  ["Ghibli Music 🎻🎶"]="https://youtube.com/playlist?list=PLNi74S754EXbrzw-IzVhpeAaMISNrzfUy&si=rqnXCZU5xoFhxfOl"
  ["Top Youtube Music 2023 ☕️🎶"]="https://youtube.com/playlist?list=PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU&si=y7qNeEVFNgA-XxKy"
  ["Chillhop ☕️🎶"]="http://stream.zeno.fm/fyn8eh3h5f8uv"
  ["SmoothChill ☕️🎶"]="https://media-ssl.musicradio.com/SmoothChill"
  ["Relaxing Music ☕️🎶"]="https://youtube.com/playlist?list=PLMIbmfP_9vb8BCxRoraJpoo4q1yMFg4CE"
)

# Function for displaying notifications
notification() {
  notify-send -u normal -i "$iDIR/music.png" "Playing now: $@"
}

# Main function
main() {
  choice=$(printf "%s\n" "${!menu_options[@]}" | wofi --dmenu -i -p "")

  if [ -z "$choice" ]; then
    exit 1
  fi

  link="${menu_options[$choice]}"

  notification "$choice"
  
  if ! [ -f /home/itan/Downloads/www.youtube.com_cookies.txt ]; then
    if [[ $link == *playlist* ]]; then
      mpv --cookies --shuffle --vid=no "$link"
    else
      mpv --cookies "$link"
    fi
  else
    if [[ $link == *playlist* ]]; then
      mpv --cookies --cookies-file='/home/itan/Downloads/www.youtube.com_cookies.txt' --shuffle --vid=no "$link"
    else
      mpv --cookies --cookies-file='/home/itan/Downloads/www.youtube.com_cookies.txt' "$link"
    fi
  fi

  # Check if the link is a playlist
}

# Check if an online music process is running and send a notification, otherwise run the main function
pkill mpv && notify-send -u low -i "$iDIR/music.png" "Online Music stopped" || main
