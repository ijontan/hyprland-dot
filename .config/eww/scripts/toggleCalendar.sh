#!/bin/bash

monitor=$(hyprctl activeworkspace | grep monitorID | awk -F ': ' 'END {print $2}')
eww open calendar --toggle --arg mon=$monitor
