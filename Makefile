all:
	@echo make what?

devserver:
	@php -S localhost:8000 router.php

lt:
	@lt --port 8000

deploy:
	@git ftp push -f --user $(ROZDILOVI_FTP_LOGIN) --passwd $(ROZDILOVI_FTP_PASS) ftp://nichogo.ftp.ukraine.com.ua/rozdilovi.org/www/

optimize-png:
	@pngquant --ext .png --force img/*.png
