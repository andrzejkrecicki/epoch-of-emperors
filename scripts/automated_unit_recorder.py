import os
import time
import sys

from autopy import mouse, key


DESELECT = True
EMP_DIR = '~/.wine/drive_c/Program Files (x86)/Age of Empires complete/'

def go_and_click(x, y, delay=.2):
    mouse.move(x, y)
    mouse.click(mouse.LEFT_BUTTON)
    time.sleep(delay)


def go_and_rclick(x, y, delay=.2):
    mouse.move(x, y)
    mouse.click(mouse.RIGHT_BUTTON)
    time.sleep(delay)

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

    # units tab
    go_and_click(385, 10)
    # Academy - first list element
    go_and_click(45, 85)

    # for i in xrange(91):
    #     key.tap(key.K_DOWN)
    #     time.sleep(.05)
    time.sleep(.05)
    key.tap('V')

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

    # select unit
    go_and_click(480, 275)

    go_and_rclick(805, 105)
    if DESELECT:
        mouse.click()
    mouse.move(500, 725)
    time.sleep(9)
    go_and_click(805, 105)


    go_and_rclick(412, 345)
    if DESELECT:
        mouse.click()
    mouse.move(500, 725)
    time.sleep(12)
    go_and_click(412, 345)


    go_and_rclick(205, 185)
    if DESELECT:
        mouse.click()
    mouse.move(500, 725)
    time.sleep(7)
    go_and_click(180, 175)


    go_and_rclick(625, 488)
    if DESELECT:
        mouse.click()
    mouse.move(500, 725)
    time.sleep(15)
    go_and_click(605, 460)


    go_and_rclick(620, 90)
    if DESELECT:
        mouse.click()
    mouse.move(500, 725)
    time.sleep(14)
    go_and_click(605, 90)


    go_and_rclick(625, 485)
    if DESELECT:
        mouse.click()
    mouse.move(500, 725)
    time.sleep(15)
    go_and_click(620, 465)


    go_and_rclick(185, 470)
    if DESELECT:
        mouse.click()
    mouse.move(500, 725)
    time.sleep(10)
    go_and_click(195, 465)


    go_and_rclick(760, 490)
    if DESELECT:
        mouse.click()
    mouse.move(500, 725)
    time.sleep(14)
    go_and_click(760, 490)


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


