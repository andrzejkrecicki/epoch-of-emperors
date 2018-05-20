import os
import json
import argparse


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='''
        Script walks recursively through all images in img directory,
        glues them together into dist/gfx.bin file, also creates
        a dist/gfx.json file which contains offset and length information
        for each found path.
    ''')
    parser.add_argument('input', default="img")
    parser.add_argument('out_bin', default="dist/gfx.bin", type=str)
    parser.add_argument('out_json', default="dist/gfx.json", type=str)
    parser.add_argument('-e', '--ext', default="png", type=str)

    args = parser.parse_args()

    data = []
    out = file(args.out_bin, "wb")
    offset = 0

    for root, dirs, files in os.walk(args.input):
        for name in files:
            if name.endswith("." + args.ext):
                path = os.path.join(root, name)
                img = file(path, "rb")
                out.write(img.read())
                size = os.path.getsize(path)
                data.append([path, size])
                offset += size
                img.close()
    out.close()

    out = file(args.out_json, "w")
    out.write(json.dumps(data).replace("\\\\", "/").replace(" ", ""))
    out.close()
