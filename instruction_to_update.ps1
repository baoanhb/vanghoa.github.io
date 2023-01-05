# Instruction to update portfolio:

# add 1 to item.json
    .{
$toAdd = @"
[
{
'name' : 'BI2P2',
'date' : '8/2021 - 10/2021',
'field' : [
{
    'name' : 'Speculative',
    'class' : 'spcl'
},
{
    'name' : 'Website development',
    'class' : 'dg_pro'
},
{
    'name' : '3D design',
    'class' : ''
}
],
'description' : 'Development of a fictional markup language systems, like HTML or XML but for organising, transporting and constructing elements in the physical world',
'soon' : false
}
]
"@

        $a = Get-Content 'D:\CODE\vanghoa.github.io\item.json' -raw | ConvertFrom-Json

        $a += (ConvertFrom-Json -InputObject $toAdd)

        $a | ConvertTo-Json -depth 32| set-content 'D:\CODE\vanghoa.github.io\item.json'
    }


# add thumbnails (change the number $a) prepare 1 thumbnail img each project:
    .{
        $a = 1
        mkdir thumbnail
        mkdir border
        mkdir home
        Get-ChildItem -File | ForEach-Object {
            magick mogrify -format jpg $_

            magick mogrify -resize 200x200> -quality 100 -path ./border "$($_.Basename).jpg"

            magick mogrify -resize 900x900> -quality 100 -path ./home "$($_.Basename).jpg"

            magick mogrify -resize 300x300> -quality 100 -path ./thumbnail "$($_.Basename).jpg"

            cd border

            Rename-item "$($_.Basename).jpg" -NewName "$($a).jpg"

            cd ../thumbnail

            Rename-item "$($_.Basename).jpg" -NewName "$($a).jpg"

            cd ../home

            Rename-item "$($_.Basename).jpg" -NewName "$($a).jpg"

            cd ..

            if ($_.extension -ne ".jpg") {
                Remove-Item $_
            }
            Remove-Item "$($_.Basename).jpg"

            $a++
        }

        cd border

        imagemin * --plugin.mozjpeg.progressive=true --plugin.mozjpeg.max=95 --plugin.mozjpeg.stripAll=true --plugin.mozjpeg.size=200 *.jpg --out-dir=./

        cd ../thumbnail

        imagemin * --plugin.mozjpeg.progressive=true --plugin.mozjpeg.max=95 --plugin.mozjpeg.stripAll=true --plugin.mozjpeg.size=200 *.jpg --out-dir=./

        cd ../home

        imagemin * --plugin.mozjpeg.progressive=true --plugin.mozjpeg.max=95 --plugin.mozjpeg.stripAll=true --plugin.mozjpeg.size=200 *.jpg --out-dir=./

        cd ..
    }

# add project_pages folder image
    .{
        mkdir out

        magick mogrify -format jpg -resize 1700x> -quality 100 -path out *

        Get-ChildItem -File | ForEach-Object { 
            Remove-Item $_
        }

        cd out

        imagemin * --plugin.mozjpeg.progressive=true --plugin.mozjpeg.max=95 --plugin.mozjpeg.stripAll=true --plugin.mozjpeg.size=200 *.jpg --out-dir=./
    }

# edit file html