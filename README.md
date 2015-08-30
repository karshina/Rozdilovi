# Develop
```bash
php -S 0.0.0.0:8000 router.php
```

You can use [localtunnel](http://localtunnel.me/) to test facebook sharing:
```bash
lt --port 8000
```

# Deploy
We use [git-ftp](https://github.com/git-ftp/git-ftp) to upload the site.
```bash
git ftp push -f --user LOGIN --passwd PASSWORD ftp://nichogo.ftp.ukraine.com.ua/rozdilovi.org/www/
```
