import argparse
import glob
import hashlib
import json
import os

from collections import defaultdict, namedtuple
from PIL import Image

ALLOWED_SUBDIRECTORIES = ['NE', 'SW', 'NW', 'SE', 'N', 'S', 'E', 'W']
HEALTH_BAR_COLOR = (0, 255, 1, 255)
SELECTION_RECT_COLOR = (255, 255, 255, 255)

Point = namedtuple('Point', ['x', 'y'])

def find_health_bar(img):
    w, h = img.size
    for y in xrange(h):
        for x in xrange(w):
            if img.getpixel((x, y)) == HEALTH_BAR_COLOR:
                return Point(x, y)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        Script iterates through all frames generated for a *selected* unit by frames_groupper.py tool.
        It removes health bar and selection rect.
        Moreover it adjusts each frame size and padding to ensure common offset.
    ''')
    parser.add_argument('dir', type=str)
    parser.add_argument('-dx', '--delta_x', default=0, type=int)
    parser.add_argument('-dy', '--delta_y', default=0, type=int)
    args = parser.parse_args()

    offsets = defaultdict(dict)
    groups = defaultdict(list)

    for path in sorted(glob.glob("{}/*/*.png".format(args.dir))):
        subdir, name = path.split('/')[-2:]
        groups[subdir].append(path)

    max_w, max_h = 0, 0
    max_hbb_x, max_hbb_y = 0, 0 # maximal health bar position found

    health_bar_pos_cache = {}

    # find size of biggest sprite and offset of the furthest healthbar
    for path in sorted(glob.glob("{}/*/*.png".format(args.dir))):
        img = Image.open(path)
        w, h = img.size
        max_w = max(w, max_w)
        max_h = max(h, max_h)

        health_bar_pos = find_health_bar(img)

        max_hbb_x = max(health_bar_pos.x, max_hbb_x)
        max_hbb_y = max(health_bar_pos.y, max_hbb_y)
        health_bar_pos_cache[path] = health_bar_pos


    for subdir, files in groups.iteritems():
        for i, path in enumerate(files):
            health_bar_pos = health_bar_pos_cache[path]

            tmp = Image.open(path)
            img = Image.new("RGBA", (max_w + max_hbb_x, max_h + max_hbb_y))
            img.paste(tmp, (max_hbb_x - health_bar_pos.x, max_hbb_y - health_bar_pos.y))

            w, h = img.size

            for y in xrange(h):
                for x in xrange(w):
                    if img.getpixel((x, y)) in (HEALTH_BAR_COLOR, SELECTION_RECT_COLOR):
                        img.putpixel((x, y), (0, 0, 0, 0))

            img.save(
                '/'.join(path.split('/')[:-1]) + '/{}_{:02d}.png'.format(subdir, i)
            )

    print max_hbb_x, max_hbb_y
