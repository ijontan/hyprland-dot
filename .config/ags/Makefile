SRC_DIR	= .
SRC		= $(shell find $(SRC_DIR) \( -name '*.ts' -o -name '*.tsx' -o -name '*.scss' -not -path "./wallust/*" \) )
INSTANCE= debug

run:
	@echo "$(SRC)" | sed "s/ /\n/g" | entr -r -s "echo -e '\nStarted new instance of $(INSTANCE)!\n' && ags run debug.ts --gtk4"

reload:
	pkill ags && pkill gjs && hyprctl dispatch exec 'ags run --gtk4 &> $HOME/.cache/ags/std.log &'
