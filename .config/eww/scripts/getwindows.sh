#!/usr/bin/env bash

# IconTheme=$(gsettings get org.gnome.desktop.interface icon-theme | tr -d "'")
# IconThemePath="/usr/share/icons/$IconTheme/"
#
# geticons() {
#   if !([[ $1 == "openwindow>>"* ]] || [[ $1 == "closewindow>>"* ]] || [ $# -eq 0 ]);  then
#     return 1
#   fi
# 	# hyprctl clients -j | jq -c .
# 	hyprctl clients -j | jq -r '.[]|[.address,.class,.monitor,.title] | @tsv ' |
# 		while IFS=$'\t' read -r address class monitor title; do
# 			if [ -f "/usr/share/applications/$class.desktop" ]; then
# 				IconName=$(cat "/usr/share/applications/$class.desktop" | grep "Icon" | awk -F '=' '{print $2}')
# 			elif [ -f "$HOME/.local/share/applications/$class.desktop" ]; then
# 				IconName=$(cat "$HOME/.local/share/applications/$class.desktop" | grep "Icon" | awk -F '=' '{print $2}')
# 			else
# 				IconName=""
# 			fi
# 			echo "
# 			{
# 				\"address\": \"$address\", 
# 				\"class\": \"$class\", 
# 				\"monitor\": \"$monitor\", 
# 				\"title\": \"$title\", 
# 				\"icon\": \"$([ -z "$IconName" ] || find $IconThemePath -name "$IconName*")\"
# 			}
# 			"
# 			# \"icon\": \"$IconName\"
# 		done | jq -c -s .
# }hkkk
#
# geticons

scripts/getWindowIcon.py
# echo '[{"img": "/ok", "title": "ok1"} ,{"img": "hi", "title": "ok2"} ,{"img": "hello", "title": "ok3"}]'
socat -u UNIX-CONNECT:$XDG_RUNTIME_DIR/hypr/"$HYPRLAND_INSTANCE_SIGNATURE"/.socket2.sock - | while read -r event; do 
# geticons $event
if [[ $event == "activewindow>>"* ]]; then
# echo '[{"img": "/ok", "title": "ok1"} ,{"img": "hi", "title": "ok2"} ,{"img": "hello", "title": "ok3"}]'
	scripts/getWindowIcon.py
fi
done
