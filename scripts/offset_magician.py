import argparse
import glob
import hashlib
import json
import os

from collections import defaultdict, namedtuple
from PIL import Image

ALLOWED_SUBDIRECTORIES = ['NE', 'SW', 'NW', 'SE', 'N', 'S', 'E', 'W']
HEALTH_BAR_COLOR = (0, 255, 1, 255)

Point = namedtuple('Point', ['x', 'y'])

def find_health_bar(img):
    w, h = img.size
    for y in xrange(h):
        for x in xrange(w):
            if img.getpixel((x, y)) == HEALTH_BAR_COLOR:
                return Point(x, y)

def find_health_bar_end(img):
    w, h = img.size
    for y in xrange(h):
        for x in xrange(1, w):
            if img.getpixel((x, y)) != HEALTH_BAR_COLOR and img.getpixel((x - 1, y)) == HEALTH_BAR_COLOR:
                return Point(x - 1, y)

def find_left_lowest_pixel(img):
    w, h = img.size
    for y in reversed(xrange(h)):
        for x in xrange(w):
            if img.getpixel((x, y))[-1] != 0 and img.getpixel((x, y)) != (255,) * 4:
                return Point(x, y)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        Script iterates through all frames generated for a unit by frames_groupper.py tool.
        It matches every unselected frame with selected frame to adjust padding and detect
        health bar coordinates used later for offset calculation.
        `selected` specifies directory with non-grouped selected sprites.
        `deselected` speficies directory with grouped deselected sprites.
        `delta_x` and `delta_y` specify delta value added to each detected offset.
        Usually delta is a value of a vector between healthbar begin
        and west corner of selection rect.

        `out` speficies output file for JSON with offsets data.
        JSON data maps sprite filename to coordinates of it's healthbar.
    ''')
    parser.add_argument('-se', '--selected', default=None, type=str)
    parser.add_argument('-ds', '--deselected', default=None, type=str)
    parser.add_argument('-dx', '--delta_x', default=0, type=int)
    parser.add_argument('-dy', '--delta_y', default=0, type=int)
    parser.add_argument('-o', '--out', default=None, type=str)
    args = parser.parse_args()

    offsets = {}

    groups = defaultdict(list)

    for path in sorted(glob.glob("{}/*/*.png".format(args.deselected))):
        subdir, name = path.split('/')[-2:]
        groups[subdir].append(path)

    for subdir, files in groups.iteritems():
        for i, path in enumerate(files):

            deselected = Image.open(path)
            selected = Image.open("{}/{}".format(args.selected, path.split('/')[-1]))

            health_bar_begin = find_health_bar(selected)
            health_bar_end = find_health_bar_end(selected)
            llp_selected = find_left_lowest_pixel(selected)
            llp_deselected = find_left_lowest_pixel(deselected)

            offsets[path.split('/')[-1]] = {
                'x': health_bar_begin.x,
                'y': health_bar_begin.y
            }

            adjusted = Image.new("RGBA", selected.size)

            adjusted.paste(deselected, (
                abs(llp_deselected.x - llp_selected.x),
                abs(llp_deselected.y - llp_selected.y)
            ))
            adjusted.save(
                '/'.join(path.split('/')[:-1]) + '/{}_{:02d}.png'.format(subdir, i)
            )

    with open(args.out, 'w') as f:
        f.write(json.dumps(offsets))
