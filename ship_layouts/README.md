# ship layouts

## Building ship_layouts.js

`make all`

## TSV files

TSV files are a map of the layout of a ship.  Each tab-separated
number is a slot where a ship module could go, and the number
indicates the order in which ship modules should be populated
(or not).  Ship layouts are meant to be flexible, so that even
a partially filled layout will still be a valid ship configuration.

For example, here is the beginning of the "boxy" tsv:

1	2	6	11	44
3	4	8	13	42
5	7	9	15	40
...

