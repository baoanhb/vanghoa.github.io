# vanghoa.github.io
I study code

imagemin * --plugin.mozjpeg.progressive=true --plugin.mozjpeg.max=95 --plugin.mozjpeg.stripAll=true --plugin.mozjpeg.size=200 *.jpg --out-dir=./out

imagemin * --plugin.pngquant.speed=1 --plugin.pngquant.quality=0.9 --plugin.pngquant.quality=0.9 *.png --out-dir=./out

foreach ($file in Get-ChildItem) { cwebp -q 100 $file -o otoke.webp }

magick mogrify -resize 1700x> -quality 100 -path out *.jpg

magick mogrify -format jpg *.jpeg   