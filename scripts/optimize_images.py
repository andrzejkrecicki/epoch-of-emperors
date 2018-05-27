import os
import argparse


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        Script walks recursively through all images in img directory,
        for each found image runs optipng tool to reduce image size.
    ''')
    parser.add_argument('input', default="img")
    parser.add_argument('-e', '--ext', default="png", type=str)
    parser.add_argument('-c', '--cmd', default="c:\optipng-0.7.7-win32\optipng.exe -o5 ", type=str)

    args = parser.parse_args()

    for root, dirs, files in os.walk(args.input):
        for name in files:
            if name.endswith("." + args.ext):
                path = os.path.join(root, name)
                os.popen2(args.cmd + path)

