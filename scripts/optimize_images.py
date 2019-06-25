import os
import argparse
import time
import subprocess

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        Script walks recursively through all images in img directory,
        for each found image runs optipng tool to reduce image size.
    ''')
    parser.add_argument('input', default="img")
    parser.add_argument('-e', '--ext', default="png", type=str)
    parser.add_argument('-c', '--cmd', default="c:\optipng-0.7.7-win32\optipng.exe -o5 ", type=str)

    args = parser.parse_args()

    t0 = time.time()

    null = open(os.devnull, 'w')

    sizes = []

    for root, dirs, files in os.walk(args.input):
        for i, name in enumerate(files):
            if name.endswith("." + args.ext):
                path = os.path.join(root, name)
                sizes.append((path, os.path.getsize(path)))
                subprocess.Popen(
                    args.cmd + path,
                    stderr=null
                )

    for path, size in sizes:
        new_size = os.path.getsize(path)
        if new_size != size:
            print "{} {} -> {} ({}%)".format(path, size, new_size, round(100 * new_size / size, 1))

    print "{} files processed. Took {}s".format(len(sizes), round(time.time() - t0, 2))