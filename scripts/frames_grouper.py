import argparse
import glob
import hashlib
import os
import shutil

from PIL import Image

# maximal acceptable number of different pixels
MAX_DIFFERENCE = 5
DIRECTIONS = ['NE', 'SW', 'NW', 'SE', 'N', 'S', 'W', 'E']


def are_pixels_different(pix1, pix2):
    # return sum(abs(v1 - v2) for v1, v2 in zip(pix1, pix2)) > 200
    # return sqrt(sum((v1 - v2)**2 for v1, v2 in zip(pix1, pix2))) > 120
    return pix1[3] != pix2[3]

def are_frames_the_same(first, second):
    f_w, f_h = first.size
    s_w, s_h = second.size

    diff = 0

    if f_w == s_w and f_h == s_h:
        for x in xrange(f_w):
            for y in xrange(f_h):
                if are_pixels_different(first.getpixel((x, y)), second.getpixel((x, y))):
                    diff += 1
                    if diff > MAX_DIFFERENCE
                        return False

        return diff <= MAX_DIFFERENCE
    else:
        return False



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        The script gets frames directory and sequence of frames numbers for analysis.
        For each specified frame number it iterates next frames until it finds the same
        frame. Each found cycle of frames is copied to a subdirectory.
        `max_difference` parameter specifies maximal number of different pixels to
        treat frames as the same.
    ''')
    parser.add_argument('dir')
    parser.add_argument('frames', nargs='+', type=int)
    parser.add_argument('-md', '--max_difference', default=MAX_DIFFERENCE, type=int)
    args = parser.parse_args()

    os.chdir(args.dir)

    for start_frame, direction in zip(args.frames, DIRECTIONS):
        first = Image.open('{:06d}.png'.format(start_frame))
        cycle_found = False
        frame = start_frame

        try:
            os.mkdir(direction)
        except:
            pass

        while not cycle_found:
            frame += 1
            try:
                curr = Image.open('{:06d}.png'.format(frame))
            except:
                continue

            shutil.copy2(
                '{:06d}.png'.format(frame),
                '{}/{:06d}.png'.format(direction, frame)
            )
            if are_frames_the_same(first, curr):
                print "{} and {} are the same.".format(start_frame, frame)
                cycle_found = True
