#!/usr/bin/bash

open() {
    hour=$(date +"%I")
    minute=$(date +"%M")
    ampm=$(date +"%P")
    if [ "$ampm" = "am" ]; then
	eww update hour=$hour minute=$minute isam=true
    else
	eww update hour=$hour minute=$minute isam=false
    fi
    eww o alarm
}

set-alarm() {
    echo "notify sent $3" | at "$2"
    eww c alarm
}

main() {
    if [[ "$1" == "open" ]]; then
        open "$@"
    elif [[ "$1" == "o" ]]; then
        open "$@"
    elif [[ "$1" == "set" ]]; then
        set-alarm "$@"
    fi
}

main "$@"
