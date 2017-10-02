import argparse
import glob
import hashlib
import os

from PIL import Image

# maximal acceptable number of different pixels
MAX_DIFFERENCE = 5


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        The script walks through all frames in a specified directory in a sorted order.
        It removes a frame if the adjecent frame differs by more than `max_difference` pixels.

        When it's done, it renames all frames to `name_prefix` + "_" n, where n is its new number.
    ''')
    parser.add_argument('dir')
    parser.add_argument('-md', '--max_difference', default=MAX_DIFFERENCE, type=int)
    parser.add_argument('-np', '--name_prefix', default=None, type=str)
    args = parser.parse_args()

    os.chdir(args.dir)

    files = iter(sorted(glob.glob("*.png")))

    prev = Image.open(files.next())
    p_w, p_h = prev.size

    for path in files:
        diff = 0
        curr = Image.open(path)
        c_w, c_h = curr.size

        if c_w == p_w and c_h == p_h:
            for x in xrange(c_w):
                for y in xrange(c_h):
                    if curr.getpixel((x, y)) != prev.getpixel((x, y)):
                        diff += 1

            if diff <= MAX_DIFFERENCE:
                os.remove(os.path.join(args.dir, path))

        prev = curr
        p_w, p_h = prev.size

        files = iter(sorted(glob.glob("*.png")))

    for i, path in enumerate(iter(sorted(glob.glob("*.png")))):
        os.rename(path, "{}_{:02d}.png".format(args.name_prefix, i))
