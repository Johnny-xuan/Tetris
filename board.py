import curses
from constants import *

class Board:
    def __init__(self, stdscr):
        self.stdscr = stdscr
        self.grid = [[0] * WIDTH for _ in range(HEIGHT)]

    def draw(self):
        # Draw border
        self.stdscr.attron(curses.color_pair(COLOR_BORDER))
        for y in range(HEIGHT + 2):
            self.stdscr.addstr(y, 0, " |")
            self.stdscr.addstr(y, WIDTH * 2 + 1, "| ")
        for x in range(WIDTH * 2 + 2):
            self.stdscr.addstr(0, x, "-")
            self.stdscr.addstr(HEIGHT + 1, x, "-")
        self.stdscr.attroff(curses.color_pair(COLOR_BORDER))

        # Draw landed pieces
        for y in range(HEIGHT):
            for x in range(WIDTH):
                if self.grid[y][x] != 0:
                    self.stdscr.attron(curses.color_pair(self.grid[y][x]))
                    self.stdscr.addstr(y + 1, x * 2 + 2, "[]")
                    self.stdscr.attroff(curses.color_pair(self.grid[y][x]))

    def is_valid_move(self, piece):
        for x_offset, y_offset in piece.shape:
            x = piece.x + x_offset
            y = piece.y + y_offset
            if not (0 <= x < WIDTH and 0 <= y < HEIGHT and self.grid[y][x] == 0):
                return False
        return True

    def place_piece(self, piece):
        for x_offset, y_offset in piece.shape:
            x = piece.x + x_offset
            y = piece.y + y_offset
            if 0 <= y < HEIGHT and 0 <= x < WIDTH:
                self.grid[y][x] = piece.color

    def clear_lines(self):
        lines_cleared = 0
        new_grid = []
        for row in self.grid:
            if all(cell != 0 for cell in row):
                lines_cleared += 1
            else:
                new_grid.append(row)
        
        new_rows = [[0] * WIDTH for _ in range(lines_cleared)]
        self.grid = new_rows + new_grid
        return lines_cleared
