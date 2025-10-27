import curses

# Game board dimensions
WIDTH = 10
HEIGHT = 20

# Screen dimensions (includes border and info panel)
SCREEN_WIDTH = WIDTH * 2 + 20
SCREEN_HEIGHT = HEIGHT + 2

# Key bindings
KEY_QUIT = ord('q')
KEY_PAUSE = ord('p')

# Game speed
INITIAL_SPEED = 0.5
SPEED_INCREMENT = 0.05
MAX_SPEED = 0.1

# Scoring
SCORE_PER_LINE = 100
TETRIS_BONUS = 400  # Bonus for clearing 4 lines at once

# Colors (using curses color pairs)
COLOR_BORDER = 1
COLOR_INFO = 2
COLOR_I = 3
COLOR_O = 4
COLOR_T = 5
COLOR_S = 6
COLOR_Z = 7
COLOR_J = 8
COLOR_L = 9
