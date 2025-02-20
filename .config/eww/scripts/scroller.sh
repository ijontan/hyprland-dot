#!/bin/bash

up() {

    if [ "$3" -lt "$5" ]; then
        eww update scroll_motion=slidedown "$2=$(bc <<< "$3+1")"
    else
        eww update scroll_motion=slidedown "$2=$4"
    fi
}

down() {
    if [ "$3" -gt "$4" ]; then
        eww update scroll_motion=slideup "$2=$(bc <<< "$3-1")"
    else
        eww update scroll_motion=slideup "$2=$5"
    fi
}


main() {
    if [[ "$1" == "up" ]]; then
        up "$@"
    elif [[ "$1" == "down" ]]; then
        down "$@"
    fi
}

main "$@"
