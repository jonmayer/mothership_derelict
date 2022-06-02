#!/usr/bin/python3
""" Converts a ship layout in tsv format to JSON file containing coordinates.

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

We want to turn that into a list of coordinates, starting from
slot #1 onwards, and output that as a JSON data set.
"""

import csv
import json
import math
import os
import sys

class Layout(object):
    def __init__(self):
        self.name = ""
        self.layout = []

    def LoadTsv(self, path):
        self.name = os.path.splitext(os.path.basename(path))[0]
        with open(path, "r", encoding="utf-8") as fd:
            tsv = csv.reader(fd, delimiter="\t")
            self.layout = list(tsv)
            fd.close()

    def GetCoords(self):
        coords = []
        for y in range(len(self.layout)):
            for x in range(len(self.layout[y])):
                index = self.layout[y][x]
                if index:
                    i = int(index, 10) - 1  # the real index
                    if len(coords) <= i:
                        coords.extend([None]*(i + 1 - len(coords)))
                    assert(not coords[i]), "Index %d is double-assigned" % i
                    coords[i] = [x, y]
        assert(None not in coords), "Index %d is missing" % coords.index(None)
        return json.dumps([self.name, coords])


def main(argv):
    data = []
    for path in argv[1:]:
        l = Layout()
        l.LoadTsv(path)
        data.append(l.GetCoords())
    print("const ship_layouts = [")
    print("  " + ",\n  ".join(data) + "];")
    print("")
    print("export default ship_layouts;")

if __name__ == "__main__":
    main(sys.argv)


        
