### Overview
This Angular application implements a simple pong game. The game involves a paddle, a bouncing ball, and walls. The objective is to bounce the ball off the paddle to break down all the walls on the screen.

### Features

**Paddle Movement:**
   - The paddle can be moved horizontally using the left and right arrow keys.

**Ball Bouncing:**
   - The ball moves in a defined direction and bounces off the walls and the paddle.

**Wall Destruction:**
   - The ball breaks down walls upon collision, and the player scores points for each destroyed wall.

**Game Restart:**
   - The game can be restarted, resetting the ball, paddle, and walls.

**Visual Effects:**
   - The game features visual effects such as a vibrating screen upon certain events.

**Sound Effects:**
   - Sound effects play when the ball bounces or collides with certain objects.

### How to Run

Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

Install dependencies:
   ```bash
   npm install
   ```
Start the development server:
   ```bash
   ng serve
   ```
Open your browser and navigate to `http://localhost:4200/`.

### Snapshot

![image](https://github.com/diegomottadev/pong-app/assets/64202326/7f91c704-a837-411e-9121-e7ed9fb32e39)


### Game Controls

- **Left Arrow Key:** Move the paddle left.
- **Right Arrow Key:** Move the paddle right.

### Code Structure

The codebase is organized into several components:

**App Component (`app.component.ts`):**
   - Initializes the game by creating a canvas and instantiating the `GameBoardComponent`.

**Game Board Component (`game-board.component.ts`):**
   - Implements the core logic of the game, including ball movement, collision detection, and rendering.

**Paddle Component (`paddle.component.ts`):**
   - Represents the paddle in the game.

**Game Service (`game-board.service.ts`):**
   - Provides a service for game-wide functionality, such as signaling a game restart.

### Limitations

**Simplicity:**
   - The game is intentionally kept simple and may lack advanced features found in commercial games.
**Scalability:**
   - The codebase is designed for educational purposes and may not be optimized for scalability or extensive feature additions.
**Graphics:**
   - The focus is on functionality, and the game lacks sophisticated graphics or animations.

### Future Improvements

**Level Design:**
   - Add multiple levels with different wall arrangements and difficulty levels.
**Scoreboard:**
   - Implement a scoreboard to track and display the player's score.
**Enhanced Graphics:**
   - Improve visual elements, including better graphics, animations, and effects.
**Mobile Compatibility:**
   - Make the game responsive for mobile devices.

### Contributing

Contributions are welcome! Feel free to open issues or pull requests.
