#!/usr/bin/env bash

pkill hyprsunset || hyprsunset -t 4000 &
pidof hyprsunset && eww update hyprsunset_active=false || eww update hyprsunset_active=true

