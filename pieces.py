import random
from constants import *

class Piece:
    SHAPES = {
        'I': [[(0, 0), (0, 1), (0, 2), (0, 3)]],
        'O': [[(0, 0), (0, 1), (1, 0), (1, 1)]],
        'T': [[(0, 0), (0, 1), (0, 2), (1, 1)]],
        'S': [[(0, 1), (0, 2), (1, 0), (1, 1)]],
        'Z': [[(0, 0), (0, 1), (1, 1), (1, 2)]],
        'J': [[(0, 0), (0, 1), (0, 2), (1, 0)]],
        'L': [[(0, 0), (0, 1), (0, 2), (1, 2)]],
    }

    COLORS = {
        'I': COLOR_I,
        'O': COLOR_O,
        'T': COLOR_T,
        'S': COLOR_S,
        'Z': COLOR_Z,
        'J': COLOR_J,
        'L': COLOR_L,
    }

    def __init__(self, shape_name, x=WIDTH // 2 - 1, y=0):
        self.shape_name = shape_name
        self.rotations = self._generate_rotations(self.SHAPES[shape_name][0])
        self.rotation_index = 0
        self.shape = self.rotations[self.rotation_index]
        self.color = self.COLORS[shape_name]
        self.x = x
        self.y = y

    def _generate_rotations(self, base_shape):
        rotations = [base_shape]
        current_shape = base_shape
        for _ in range(3):
            # Rotate 90 degrees: (x, y) -> (y, -x) then normalize
            rotated_shape = [(y, -x) for x, y in current_shape]
            min_x = min(p[0] for p in rotated_shape)
            min_y = min(p[1] for p in rotated_shape)
            # Normalize to top-left corner
            normalized_shape = sorted([(x - min_x, y - min_y) for x, y in rotated_shape])
            if normalized_shape not in rotations:
                rotations.append(normalized_shape)
            current_shape = rotated_shape
        return rotations

    def rotate(self):
        self.rotation_index = (self.rotation_index + 1) % len(self.rotations)
        self.shape = self.rotations[self.rotation_index]

    def un_rotate(self):
        self.rotation_index = (self.rotation_index - 1 + len(self.rotations)) % len(self.rotations)
        self.shape = self.rotations[self.rotation_index]

    def move(self, dx, dy):
        self.x += dx
        self.y += dy

    @staticmethod
    def get_random_piece():
        shape_name = random.choice(list(Piece.SHAPES.keys()))
        return Piece(shape_name)
