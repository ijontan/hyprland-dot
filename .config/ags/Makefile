SRC_DIR	= .
SRC		= $(shell find $(SRC_DIR) \( -name '*.ts' -o -name '*.tsx' -o -name '*.scss' \) )

run:
	@echo "$(SRC)" | sed "s/ /\n/g" | entr -r -s "ags run --gtk4"
