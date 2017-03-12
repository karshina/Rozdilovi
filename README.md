# rozdiLOVi

The virtual version of the interdisciplinary art project “rozdiLOVi” by ArtPole Agency / Ukraine. 
Text and voice: Serhiy Zhadan, idea and visualization: Olia Mykhailyuk, music: Aleksey Vorsoba and Vlad Kreymer.

More info:
* http://rozdilovi.org/about-ua.html (UA)
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
