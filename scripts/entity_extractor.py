import argparse
import glob

from collections import namedtuple, deque
from PIL import Image, ImageDraw


Point = namedtuple('Point', ['x', 'y'])

def entity_bounding_rect(img, start, BG_COL):
    queue = deque([(start.x, start.y, 4)])

    width, height = img.size
    min_x, min_y = width, height
    max_x, max_y = 0, 0

    visited = {}

    while len(queue):
        x, y, counter = queue.popleft()
        if counter > 0 and not visited.get((x, y)):
            visited[(x, y)] = True

            if img.getpixel((x, y)) != BG_COL:
                counter = 4
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
            else:
                counter -= 1

            if x-1 >= 0:
                queue.append((x-1, y, counter))

            if x+1 < width:
                queue.append((x+1, y, counter))

            if y-1 >= 0:
                queue.append((x, y-1, counter))

            if y+1 < height:
                queue.append((x, y+1, counter))

    return Point(min_x, min_y), Point(max_x + 1, max_y + 1)



argpar = argparse.ArgumentParser()
argpar.add_argument('img1')
argpar.add_argument('img2')
argpar.add_argument('--crop_x', default=None, type=int)
argpar.add_argument('--crop_y', default=None, type=int)
argpar.add_argument('--crop_w', default=None, type=int)
argpar.add_argument('--crop_h', default=None, type=int)
args = argpar.parse_args()

img1 = Image.open(args.img1).convert("RGBA")
img2 = Image.open(args.img2).convert("RGBA")

if args.crop_x and args.crop_y and args.crop_w and args.crop_h:
    img1 = img1.crop((args.crop_x, args.crop_y, args.crop_w, args.crop_h))
    img2 = img2.crop((args.crop_x, args.crop_y, args.crop_w, args.crop_h))

width, height = img1.size

for y in xrange(height):
    for x in xrange(width):
        if img1.getpixel((x, y)) == img2.getpixel((x, y)):
            img2.putpixel((x, y), (0, 0, 0, 0))

num_tiles = len(glob.glob("./extracted/*.png"))

img2.save("./tmp.png")
img2_draw = ImageDraw.Draw(img2)

for y in xrange(height):
    for x in xrange(width):
        if img2.getpixel((x, y)) != (0, 0, 0, 0):
            p1, p2 = entity_bounding_rect(img2, Point(x, y), (0, 0, 0, 0))
            if p2.x - p1.x > 0 and p2.y - p1.y > 0:
                print p1, p2
                entity = img2.crop((p1 + p2))
                entity.save("./extracted/{:02d}.png".format(num_tiles));
                num_tiles += 1
                img2_draw.rectangle((p1, p2), fill=(0, 0, 0, 0))
