import os
import argparse
import re
from PIL import Image
import subprocess

import time


OPTI_PNG = "c:\optipng-0.7.7-win32\optipng.exe -o5 "

DIRECTIONS_ORDER = {
    'N': '00',
    'S': '01',
    'SW': '02',
    'W': '03',
    'NW': '04',
}


def filename_key(name):
    parts = name.split("_")
    return DIRECTIONS_ORDER[parts[0]] + parts[1]

def clean(files):
    files = [f for f in files if f != '__glued.png'];
    if all("_" in f and f.split("_")[0] in DIRECTIONS_ORDER for f in files):
        return files
    else:
        return []


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        Script walks recursively through all images in img directory,
        glues them together to a single very long one per each directory
    ''')
    parser.add_argument('input', default="img")
    parser.add_argument('-e', '--ext', default="png", type=str)

    args = parser.parse_args()

    null = open(os.devnull, 'w')


    for root, dirs, files in os.walk(args.input):
        images = []
        for name in sorted(clean(files), key=filename_key):
            if name.endswith("." + args.ext):
                path = os.path.join(root, name)
                img = Image.open(path)
                images.append(img)

        if images:
            w, h = images[0].size
            glued = Image.new("RGBA", (w * len(images), h))

            for i, img in enumerate(images):
                glued.paste(img, (w * i, 0))
            glued.save(os.path.join(root, "__glued.png"))

            subprocess.Popen(
                OPTI_PNG + os.path.join(root, "__glued.png"),
                stderr=null
            )
