all:
	@echo make what?

optimize-png:
	@pngquant --ext .png --force img/*.png
