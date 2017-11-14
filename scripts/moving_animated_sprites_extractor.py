import argparse
import hashlib
import numpy
import time

from collections import deque, namedtuple
from moviepy.editor import VideoFileClip
from PIL import Image, ImageDraw

Point = namedtuple('Point', ['x', 'y'])

visited = {}

def extract_difference_as_image(start, frame1, frame2, canvas, draw):
    # extracts continous area of different pixels between `frame1` and `frame2`
    # works by launching BFS walk started at `start` parameter
    # for object-tracking purposes, it returns x, y coordinates of minimal bounding box
    # third returned value is a sprite itself
    queue = deque([(start.x, start.y, 5)])

    width, height = frame1.size
    min_x, min_y = width, height
    max_x, max_y = 0, 0

    while len(queue):
        x, y, counter = queue.popleft()
        if not visited.get((x, y)):
            if counter == 0:
                continue

            visited[(x, y)] = True

            pix1 = frame1.getpixel((x, y))
            pix2 = frame2.getpixel((x, y))

            if pix1 == pix2:
                counter -= 1

            if pix1 != pix2:
                counter = 5
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)

                canvas.putpixel((x, y), frame2.getpixel((x, y)))

            if True:
                if x-1 >= 0:
                    queue.append((x-1, y, counter))

                if x+1 < width:
                    queue.append((x+1, y, counter))

                if y-1 >= 0:
                    queue.append((x, y-1, counter))

                if y+1 < height:
                    queue.append((x, y+1, counter))

    visited[(start.x, start.y)] = True
    sprite = canvas.crop((min_x, min_y, max_x+1, max_y+1))
    draw.rectangle((min_x, min_y, max_x, max_y), fill=(0, 0, 0, 0))
    return (min_x + max_x) / 2, (min_y + max_y) / 2, sprite


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        Detects a moving object, tracks it, extracts single sprites, erases surrounding background.

        To preform flawless background removal it requires `magic_background` parameter which has
        to be a bitmap containing a background of recording, without presence of object which is
        going to be extracted. If `magic_background` is missing, first frame of video is used.

        `target_x` and `target_y` parameters are coordinates of initial position of tracked object.
    ''')
    parser.add_argument('input')
    parser.add_argument('-cb', '--clip_begin', default=0, type=float)
    parser.add_argument('-ce', '--clip_end', default=None, type=float)
    parser.add_argument('-tx', '--target_x', default=None, type=int)
    parser.add_argument('-ty', '--target_y', default=None, type=int)
    parser.add_argument('-mb', '--magic_background', default=None, type=str)
    parser.add_argument('-o', '--out', default=None, type=str)

    args = parser.parse_args()

    clip = VideoFileClip(args.input)
    clip = clip.subclip(args.clip_begin, args.clip_end or clip.duration)

    frames_iterator = clip.iter_frames()

    if args.magic_background is not None:
        first = Image.open(args.magic_background)
    else:
        first = Image.fromarray(frames_iterator.next())

    width, height = first.size

    # canvas for temporary drawing and buffering sprites
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(canvas)

    tx = args.target_x
    ty = args.target_y

    t0 = time.clock()

    total_sprites = 0
    duplicates = {}

    print "Starting frames processing."
    for i, curr in enumerate(frames_iterator):
        # print i,
        # for each detected object, a bounding box nearest to the bounding box
        # of the tracked object will be chosen as a new viewport
        candidate_tx, candidate_ty = None, None
        candidate_diff = 100000

        curr = Image.fromarray(curr)

        for y in xrange(ty - 60, ty + 60):
            for x in xrange(tx - 60, tx + 60):
                if visited.get((x, y)) is None and curr.getpixel((x, y)) != first.getpixel((x, y)):

                    ntx, nty, sprite = extract_difference_as_image(
                        Point(x, y), first, curr, canvas, cdraw
                    )

                    w, h = sprite.size
                    # exclude small glitches
                    if w > 6 and h > 6:
                        sprite.save("{}/{:06d}.png".format(args.out, total_sprites))
                        total_sprites += 1

                        # if current bounding box is closer than best candidate
                        # choose it as a best candidate
                        if abs(ntx - tx) + abs(nty - ty) < candidate_diff:
                            candidate_diff = abs(ntx - tx) + abs(nty - ty)
                            candidate_tx, candidate_ty = ntx, nty

        if candidate_tx is not None and candidate_ty is not None:
            tx, ty = candidate_tx, candidate_ty

        prev = curr
        visited = {}
        t1 = time.clock()
        # print t1 - t0
        t0 = t1
