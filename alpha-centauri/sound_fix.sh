#!/bin/sh

# NOTE: This file is from https://www.gog.com/forum/sid_meier_s_alpha_centauri_/fix_for_static_sound

DIR0=fx;
DIR1="$DIR0.org";
DIR2="$DIR0.mod";

# If the new directory does not exist rename the existing one
if [ ! -d "$DIR1" ]
then
mv -v "$DIR0" "$DIR1"
fi

# If the modded directory does not exist create it, otherwise delete its contents
if [ ! -d "$DIR2" ]
then
mkdir "$DIR2"
else
rm -v "$DIR2"/*
fi

# Save the modded originals in the mod folder
for FILES in $DIR1/*.wav
do
FILE="`echo $FILES|rev|cut -d '/' -f 1|rev`"
sox "$DIR1/$FILE" --norm=-1 "$DIR2/$FILE" pad 0.1 2.4 rate -v 22050 dither
done

# Copy over any unmodified file
cp -nv "$DIR1"/* "$DIR2"

# Symlink the mod folder to appear as the original folder
if [ ! -L "$DIR0" ]
then
ln -sv "$DIR2" "$DIR0"
fi
