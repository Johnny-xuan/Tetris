import curses
from game import Game
from constants import *

def setup_colors():
    curses.start_color()
    curses.init_pair(COLOR_BORDER, curses.COLOR_WHITE, curses.COLOR_BLACK)
    curses.init_pair(COLOR_INFO, curses.COLOR_WHITE, curses.COLOR_BLACK)
    curses.init_pair(COLOR_I, curses.COLOR_CYAN, curses.COLOR_CYAN)
    curses.init_pair(COLOR_O, curses.COLOR_YELLOW, curses.COLOR_YELLOW)
    curses.init_pair(COLOR_T, curses.COLOR_MAGENTA, curses.COLOR_MAGENTA)
    curses.init_pair(COLOR_S, curses.COLOR_GREEN, curses.COLOR_GREEN)
    curses.init_pair(COLOR_Z, curses.COLOR_RED, curses.COLOR_RED)
    curses.init_pair(COLOR_J, curses.COLOR_BLUE, curses.COLOR_BLUE)
    curses.init_pair(COLOR_L, curses.COLOR_WHITE, curses.COLOR_WHITE) # Curses has limited colors, using white for orange

def main(stdscr):
    curses.curs_set(0) # Hide cursor
    setup_colors()
    
    game = Game(stdscr)
    
    # Optional: Add a start screen
    stdscr.clear()
    stdscr.addstr(HEIGHT // 2 - 2, WIDTH - 10, "Welcome to Terminal Tetris!")
    stdscr.addstr(HEIGHT // 2, WIDTH - 8, "Press any key to start")
    stdscr.getch()

    game.run()
    game.show_game_over()

if __name__ == '__main__':
    try:
        curses.wrapper(main)
    except curses.error as e:
        print(f"Error running game: {e}")
        print("Your terminal window might be too small.")
        print(f"Please ensure it is at least {SCREEN_WIDTH} columns and {SCREEN_HEIGHT} rows.")
