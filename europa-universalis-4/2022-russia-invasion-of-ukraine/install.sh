#!/bin/sh

# Marker text is used to make the script idempotent even if the source or destination files change
marker_text="# Customisations start here"
# Don't quote the variable here or the ~ won't expand
path_to_mod=~/.local/share/Steam/steamapps/workshop/content/236850/217416366/history/countries

for country_file in *.txt; do
    # Remove new additions first so we can re-add them in case they've changed
    if grep -q "${marker_text}" "${path_to_mod}/${country_file}"; then
        perl -0777 -pi -e "s/\n\n${marker_text}.*//s" "${path_to_mod}/${country_file}"
    fi

    # Add a couple newlines since the country files don't have trailing newlines
    # Use printf instead of echo since sh echo doesn't support echo -e
    printf "\n\n" >> "${path_to_mod}/${country_file}"

    echo "${marker_text}" >> "${path_to_mod}/${country_file}"

    # Add our changes
    cat "${country_file}" >> "${path_to_mod}/${country_file}"
done
