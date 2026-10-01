#!/bin/sh
# Build all gears into docs/compare/ ONLY (gitignored, behind docs/luffy-compare.html).
# public/art/luffy is frozen while the Design Lead animates it: promote there only when told to.
cd "$(dirname "$0")" && mkdir -p ../../../../docs/compare && python build.py ../../../../docs/compare g1 g2 g3 g4 g5
