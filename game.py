import curses
import time
from constants import *
from board import Board
from pieces import Piece

class Game:
    def __init__(self, stdscr):
        self.stdscr = stdscr
        self.board = Board(stdscr)
        self.current_piece = Piece.get_random_piece()
        self.next_piece = Piece.get_random_piece()
        self.score = 0
        self.level = 1
        self.speed = INITIAL_SPEED
        self.game_over = False
        self.paused = False

    def run(self):
        self.stdscr.nodelay(True)
        last_fall_time = time.time()

        while not self.game_over:
            self.handle_input()
            if self.paused:
                self.draw_pause_screen()
                time.sleep(0.1)
                continue

            current_time = time.time()
            if current_time - last_fall_time > self.speed:
                self.move_piece(0, 1)
                last_fall_time = current_time

            self.draw()
            time.sleep(0.02) # Small sleep to prevent high CPU usage

    def handle_input(self):
        try:
            key = self.stdscr.getch()
            if key == curses.KEY_LEFT:
                self.move_piece(-1, 0)
            elif key == curses.KEY_RIGHT:
                self.move_piece(1, 0)
            elif key == curses.KEY_DOWN:
                self.move_piece(0, 1)
                self.score += 1 # Bonus for manual drop
            elif key == curses.KEY_UP:
                self.rotate_piece()
            elif key == KEY_QUIT:
                self.game_over = True
            elif key == KEY_PAUSE:
                self.paused = not self.paused
        except curses.error:
            pass # No input

    def move_piece(self, dx, dy):
        self.current_piece.move(dx, dy)
        if not self.board.is_valid_move(self.current_piece):
            self.current_piece.move(-dx, -dy)
            if dy > 0: # Collision while moving down
                self.lock_piece()
        
    def rotate_piece(self):
        self.current_piece.rotate()
        if not self.board.is_valid_move(self.current_piece):
            self.current_piece.un_rotate()

    def lock_piece(self):
        self.board.place_piece(self.current_piece)
        lines_cleared = self.board.clear_lines()
        self.update_score(lines_cleared)
        
        self.current_piece = self.next_piece
        self.next_piece = Piece.get_random_piece()

        if not self.board.is_valid_move(self.current_piece):
            self.game_over = True

    def update_score(self, lines_cleared):
        if lines_cleared > 0:
            if lines_cleared == 4:
                self.score += SCORE_PER_LINE * lines_cleared + TETRIS_BONUS
            else:
                self.score += SCORE_PER_LINE * lines_cleared
            
            # Update level and speed
            self.level = 1 + (self.score // 500)
            self.speed = max(MAX_SPEED, INITIAL_SPEED - (self.level - 1) * SPEED_INCREMENT)

    def draw(self):
        self.stdscr.clear()
        self.board.draw()
        self.draw_current_piece()
        self.draw_info_panel()
        self.stdscr.refresh()

    def draw_current_piece(self):
        self.stdscr.attron(curses.color_pair(self.current_piece.color))
        for x_offset, y_offset in self.current_piece.shape:
            x = self.current_piece.x + x_offset
            y = self.current_piece.y + y_offset
            self.stdscr.addstr(y + 1, x * 2 + 2, "[]")
        self.stdscr.attroff(curses.color_pair(self.current_piece.color))

    def draw_info_panel(self):
        info_x = WIDTH * 2 + 5
        self.stdscr.attron(curses.color_pair(COLOR_INFO))
        self.stdscr.addstr(2, info_x, f"Score: {self.score}")
        self.stdscr.addstr(3, info_x, f"Level: {self.level}")
        self.stdscr.addstr(5, info_x, "Next Piece:")
        
        # Draw next piece
        self.stdscr.attron(curses.color_pair(self.next_piece.color))
        for x_offset, y_offset in self.next_piece.shape:
            self.stdscr.addstr(7 + y_offset, info_x + x_offset * 2, "[]")
        self.stdscr.attroff(curses.color_pair(self.next_piece.color))

        self.stdscr.addstr(12, info_x, "Controls:")
        self.stdscr.addstr(13, info_x, "Arrows: Move/Rotate")
        self.stdscr.addstr(14, info_x, "P: Pause")
        self.stdscr.addstr(15, info_x, "Q: Quit")
        self.stdscr.attroff(curses.color_pair(COLOR_INFO))

    def draw_pause_screen(self):
        self.stdscr.attron(curses.color_pair(COLOR_INFO))
        self.stdscr.addstr(HEIGHT // 2, WIDTH - 4, " PAUSED ")
        self.stdscr.attroff(curses.color_pair(COLOR_INFO))
        self.stdscr.refresh()

    def show_game_over(self):
        self.stdscr.nodelay(False) # Wait for input
        self.stdscr.clear()
        self.stdscr.attron(curses.color_pair(COLOR_INFO))
        self.stdscr.addstr(HEIGHT // 2 - 2, WIDTH - 5, " GAME OVER ")
        self.stdscr.addstr(HEIGHT // 2, WIDTH - 6, f"Final Score: {self.score}")
        self.stdscr.addstr(HEIGHT // 2 + 2, WIDTH - 10, "Press any key to exit")
        self.stdscr.attroff(curses.color_pair(COLOR_INFO))
        self.stdscr.getch()
