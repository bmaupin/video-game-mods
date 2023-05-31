#!/bin/sh

# Add a couple newlines; use printf instead of echo since sh echo doesn't support echo -e
printf "\n\n" >> ~/.local/share/Steam/steamapps/workshop/content/236850/217416366/history/countries/"RUS - Russia.txt"
printf "\n\n" >> ~/.local/share/Steam/steamapps/workshop/content/236850/217416366/history/countries/"UKR - Ukraine.txt"

# Add our changes
cat "RUS - Russia.txt" >> ~/.local/share/Steam/steamapps/workshop/content/236850/217416366/history/countries/"RUS - Russia.txt"
cat "UKR - Ukraine.txt" >> ~/.local/share/Steam/steamapps/workshop/content/236850/217416366/history/countries/"UKR - Ukraine.txt"
