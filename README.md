# rozdiLOVi

The virtual version of the interdisciplinary art project “rozdiLOVi” (http://www.artpole.org/ENG/archive/2016/2016_rozdilovi.html) starring Serhij Zhadan, Olia Mykhailiuk, Alexey Vorsoba and Vlad Kreimer.

More info:
* https://docs.google.com/document/d/1hm98ssjuLyB7wEDKmShQBXKuapEC6Rquxp07NsLByAE/edit?usp=sharing
* http://www.5books.club/rozdilovi/

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
