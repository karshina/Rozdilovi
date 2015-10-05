# Develop
To have the local site available on http://localhost:8000 (you need PHP to make it work):
```bash
make devserver
```

You can use [localtunnel](http://localtunnel.me/) to test facebook sharing:
```bash
make lt
```

To optimize png images:
```bash
make optimize-png
```



# Deploy
We use [git-ftp](https://github.com/git-ftp/git-ftp) to upload the site.

You will need to have the following environment variables in place:

* `ROZDILOVI_FTP_LOGIN`
* `ROZDILOVI_FTP_PASS`

```bash
make deploy
```
