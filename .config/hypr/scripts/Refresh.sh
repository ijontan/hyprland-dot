#!/bin/bash

# Kill already running processes
_ps=(rofi swaync)
for _prs in "${_ps[@]}"; do
    if pidof "${_prs}" >/dev/null; then
        pkill "${_prs}"
    fi
done

swaync > /dev/null 2>&1 &

exit 0
