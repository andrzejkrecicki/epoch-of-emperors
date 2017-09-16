import argparse

from collections import namedtuple, deque
from PIL import Image, ImageDraw


Point = namedtuple('Point', ['x', 'y'])

def entity_bounding_rect(img, start, BG_COL):
    queue = deque([start])

    width, height = img.size
    min_x, min_y = width, height
    max_x, max_y = 0, 0

    visited = {}

    while len(queue):
        x, y = queue.popleft()
        if img.getpixel((x, y)) != BG_COL and not visited.get((x, y)):

            visited[(x, y)] = True

            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

            if x-1 >= 0:
                queue.append((x-1, y))

            if x+1 < width:
                queue.append((x+1, y))

            if y-1 >= 0:
                queue.append((x, y-1))

            if y+1 < height:
                queue.append((x, y+1))

    return Point(min_x, min_y), Point(max_x, max_y)



argpar = argparse.ArgumentParser()
argpar.add_argument('img1')
argpar.add_argument('img2')
args = argpar.parse_args()

img1 = Image.open(args.img1).convert("RGBA")
img2 = Image.open(args.img2).convert("RGBA")
width, height = img1.size

num_tiles = 0
for y in xrange(height):
    for x in xrange(width):
        if img1.getpixel((x, y)) == img2.getpixel((x, y)):
            img2.putpixel((x, y), (0, 0, 0, 0))


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
