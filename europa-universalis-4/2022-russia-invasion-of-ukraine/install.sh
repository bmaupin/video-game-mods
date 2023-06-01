#!/bin/sh

marker_text="# New additions start here"
# Don't quote this or the ~ won't expand
path_to_mod=~/.local/share/Steam/steamapps/workshop/content/236850/217416366/history/countries

for country_file in *.txt; do
    if ! grep -q "${marker_text}" "${path_to_mod}/${country_file}"; then
        # Add a couple newlines; use printf instead of echo since sh echo doesn't support echo -e
        printf "\n\n" >> "${path_to_mod}/${country_file}"

        # Add marker text to the file so we can make this script idempotent
        echo "${marker_text}" >> "${path_to_mod}/${country_file}"

        # Add our changes
        cat "${country_file}" >> "${path_to_mod}/${country_file}"
    fi
done
