SRC_DIR	= .
SRC		= $(shell find $(SRC_DIR) \( -name '*.ts' -o -name '*.tsx' -o -name '*.scss' \) )

run:
	@echo "$(SRC)" | sed "s/ /\n/g" | entr -r -s "echo -e '\nStarted new instance of ags!\n' && ags run --gtk4"
