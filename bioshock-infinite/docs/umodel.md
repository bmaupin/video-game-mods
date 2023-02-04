# umodel (UE Viewer)

[https://www.gildor.org/en/projects/umodel](https://www.gildor.org/en/projects/umodel)

#### List objects in package files

e.g.

```
for file in *.xxx; do
  results=$(umodel -list "$file" | egrep -i "blood|gibs|gore" | grep -i mask)
  if [ -n "$results" ]; then
    echo "$file"
    echo "$results"
    echo
  fi
done
```

#### Find the byte offset of an object

e.g.

```
umodel -list S_Light_P.xxx | grep BloodSplat_MASK
7053   BC8E0C      CA9 Texture2D BloodSplat_MASK
```

The byte offset is `0xbc8e0c`

#### Find which `Package` object an object is in

1. View the file with umodel, e.g.

   ```
   umodel -view CoalescedItems.xxx BloodSplat_MASK
   ```

1. Look at the top line, e.g.

   ```
   Package : S_Light_P.xxx (FX_SplatterTextures)
   ```

   (The object is in the `FX_SplatterTextures` `Package` object)
