
config_file="/tmp/bar_cava_config_l"
cat >"$config_file" <<EOF
[general]
bars = 70
framerate = 120

[input]
method = pulse
source = auto

[output]
method = raw
raw_target = /dev/stdout
data_format = ascii
ascii_max_range = 120

[smoothing]
integral = 40
gravity = 130
EOF

sleep 0.2
# Kill cava if it's already running
pkill -f "cava -p $config_file"

cava -p "$config_file" | sed -u "s/;/,/g; s/\(.*\),/[\1]/"
