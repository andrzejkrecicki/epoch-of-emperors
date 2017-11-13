import os
import time
import sys

from autopy import mouse, key
from collections import namedtuple
from itertools import product

EMP_DIR = os.environ['HOME'] + '/.wine/drive_c/Program Files (x86)/Age of Empires complete/'
FFMPEG_CMD = (
    "ffmpeg -video_size 1024x768 -framerate 30 "
    "-f x11grab -i :0.0 -c:v libx264 -qp 0 "
    "-preset ultrafast "
)


def go_and_click(x, y, delay=.1):
    mouse.move(x, y)
    mouse.click(mouse.LEFT_BUTTON)
    time.sleep(delay)


def go_and_rclick(x, y, delay=.1):
    mouse.move(x, y)
    mouse.click(mouse.RIGHT_BUTTON)
    time.sleep(delay)


def start_recording(unit, deselect):
    res = os.popen2(FFMPEG_CMD + "vids/{}-{}.mkv".format(
        unit, 'deselect' if deselect else 'select'
    ))
    time.sleep(1)
    return res

def stop_recording(stdin):
    stdin.write('q')
    stdin.write('Q')
    stdin.flush()
    time.sleep(1)


UnitMeta = namedtuple('UnitMeta', ['key', 'count'])
UNITS_META = {
    'centurion': UnitMeta('C', 6),
    'villager': UnitMeta('V', 1),
    'short-sword': UnitMeta('S', 5),
}

def pick_unit(name):
    for i in xrange(UNITS_META[name].count):
        key.tap(UNITS_META[name].key)

UNITS = ('villager', 'short-sword') #('centurion', 'villager')


if __name__ == '__main__':
    os.chdir(EMP_DIR)
    os.popen2('wine "{}EMPIRESX.EXE"'.format(EMP_DIR))

    # initial delay 
    time.sleep(3)


    # create scenario
    go_and_click(470, 560)
    # edit scenario
    go_and_click(512, 380)
    # ok button
    go_and_click(180, 730)

    # loading
    time.sleep(2)

    for unit, deselect in product(UNITS, (False, True)):
        # units tab
        go_and_click(385, 10)
        # Academy - first list element
        go_and_click(45, 85)

        time.sleep(.05)
        pick_unit(unit)

        # place unit
        go_and_click(570, 357)

        # menu
        go_and_click(995, 30)

        # test
        go_and_click(512, 475)

        time.sleep(2)

        key.tap(key.K_RETURN)
        time.sleep(.05)
        key.type_string('reveal map')
        time.sleep(.05)
        key.tap(key.K_RETURN)
        time.sleep(.05)
        key.tap(key.K_RETURN)
        time.sleep(.05)
        key.type_string('no fog')
        time.sleep(.05)
        key.tap(key.K_RETURN)

        time.sleep(1)

        stdin, stdout = start_recording(unit, deselect)

        # select unit
        go_and_click(480, 275)

        go_and_rclick(805, 105)
        if deselect:
            mouse.click()
        mouse.move(500, 725)
        time.sleep(9)
        go_and_click(805, 105)


        go_and_rclick(412, 345)
        if deselect:
            mouse.click()
        mouse.move(500, 725)
        time.sleep(12)
        go_and_click(412, 345)


        go_and_rclick(205, 185)
        if deselect:
            mouse.click()
        mouse.move(500, 725)
        time.sleep(7)
        go_and_click(180, 175)


        go_and_rclick(625, 488)
        if deselect:
            mouse.click()
        mouse.move(500, 725)
        time.sleep(15)
        go_and_click(605, 460)


        go_and_rclick(620, 90)
        if deselect:
            mouse.click()
        mouse.move(500, 725)
        time.sleep(14)
        go_and_click(605, 90)


        go_and_rclick(625, 485)
        if deselect:
            mouse.click()
        mouse.move(500, 725)
        time.sleep(15)
        go_and_click(620, 465)


        go_and_rclick(185, 470)
        if deselect:
            mouse.click()
        mouse.move(500, 725)
        time.sleep(10)
        go_and_click(195, 465)


        go_and_rclick(760, 490)
        if deselect:
            mouse.click()
        mouse.move(500, 725)
        time.sleep(14)
        go_and_click(760, 490)

        stop_recording(stdin)

        # menu
        go_and_click(975, 10)
        # quit
        go_and_click(512, 210)
        # yes
        go_and_click(420, 410)
        time.sleep(1)

        # units tab
        go_and_click(385, 10)

        # delte checkbox
        go_and_click(175, 690)

        # delete unit
        go_and_click(570, 357)

        # place checkbox
        go_and_click(175, 660)


