#!/usr/bin/env bash


timestamp() {
  date +%s%N
}

i=0
images="/home/marina/node_projects/borisoldfart/client/Gallery/images/*"
ts=$(timestamp)
for f in $images; do
    i=$((i+1))
    echo $f
    if [[ $f != *"resized"* ]]; then
        echo $f
        echo $ts
        convert "$f" -auto-orient -resize 1920x1080\> /home/marina/node_projects/borisoldfart/client/Gallery/images/"$i"__"$ts"__resized."${f##*.}"
        rm -rf "$f"
    fi
done