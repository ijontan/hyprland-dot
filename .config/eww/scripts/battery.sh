#!/bin/bash

get_watt() {
	awk '{print $1*10^-6 "w"}' /sys/class/power_supply/BAT0/power_now
}

get_volt() {
	awk '{print $1*10^-6 "V"}' /sys/class/power_supply/BAT0/voltage_now
}

get_perc() {
	acpi | awk -F ': |, ' 'END {print $3}' | tr -d \%,
}

get_icon() {
	BATTERY="$(acpi | awk -F ': |, ' 'END {print $3}' | tr -d \%)"
	CHARGE="$(acpi | awk -F ': |, ' 'END {print $2}')"
	if [[ $CHARGE == "Discharging" ]]; then
		if (( BATTERY >= 100 )); then
			echo "󰁹 "
		elif (( BATTERY >= 90 )); then
			echo "󰂂 "
		elif (( BATTERY >= 90)); then
			echo "󰂁 "
		elif (( BATTERY >= 70)); then
			echo "󰂀 "
		elif (( BATTERY >= 60)); then
			echo "󰁿 "
		elif (( BATTERY >= 50)); then
			echo "󰁾 "
		elif (( BATTERY >= 40)); then
			echo "󰁽 "
		elif (( BATTERY >= 30)); then
			echo "󰁼 "
		elif (( BATTERY >= 20)); then
			echo "󰁻 "
		elif (( BATTERY >= 10)); then
			echo "󰁺 "
		else
			echo "󰂎 "
		fi
	else
		if (( BATTERY >= 100 )); then
			echo "󰂅 "
		elif (( BATTERY >= 90 )); then
			echo "󰂋 "
		elif (( BATTERY >= 90)); then
			echo "󰂊 "
		elif (( BATTERY >= 70)); then
			echo "󰢞 "
		elif (( BATTERY >= 60)); then
			echo "󰂉 "
		elif (( BATTERY >= 50)); then
			echo "󰢝 "
		elif (( BATTERY >= 40)); then
			echo "󰂈 "
		elif (( BATTERY >= 30)); then
			echo "󰂇 "
		elif (( BATTERY >= 20)); then
			echo "󰂆 "
		elif (( BATTERY >= 10)); then
			echo "󰢜 "
		else
			echo "󰢟 "
		fi
	fi
}
case "$1" in
	"--perc")
		get_perc
		;;
	"--icon")
		get_icon
		;;
	"--watt")
		get_watt
		;;
	"--volt")
		get_volt
		;;
	*)
		;;
esac

