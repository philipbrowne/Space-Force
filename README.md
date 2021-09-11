# SPACE FORCE

![](https://space-force-game.herokuapp.com/assets/images/header-img.png)

## **Lead a Space Force Officer Through Mars**

Captain Jimmy McSpacerton is lost on Mars. Help Jimmy search for the elusive and magical Mintbean Star to help him find his way home!

## **How to Play**

- Guide Captain McSpacerson through the dangerous Mars terrain, avoiding obstacles such as spikes, lava, green poison, fireballs, and more...
- Running into or stepping on these VERY harmful objects will hurt Jimmy and deduct 25% from his health. Be careful! If you run out of health, it's GAME OVER.
- However, there’s good news! A very generous inhabitant decided to leave several health packs throughout the level! These health packs will not only restore 50% of Jimmy’s health, but also provide a BRAND NEW checkpoint should Jimmy run into any trouble during his adventures!
- Traverse across and up the dangerous platform terrain and reach the top where you will find the magical Mintbean Star and achieve GLORIOUS VICTORY!

## **Controls**

- **Move Left** Press A, the Left Arrow key , or click/touch the button on the screen.
- **Move Right** Press D, the Right Arrow key , or click/touch the button on the screen.
- **Jump** Press W, the Up Arrow key , the Space Bar, or click/touch the button on the screen.
- **Toggle Touch Display** Press TAB or click Toggle Touch Buttons on the Upper Left Corner of the Screen

![](https://space-force-game.herokuapp.com/assets/images/keys.png)

## **Screenshots and Demo Video Link**

![](https://space-force-game.herokuapp.com/assets/images/screenshot.png)

![](https://space-force-game.herokuapp.com/assets/images/screenshot-2.png)

![](https://space-force-game.herokuapp.com/assets/images/screenshot-3.png)

#### **Video Demo:**

**https://space-force-game.herokuapp.com/assets/video/Space-Force-Demo.mp4**

## **Deployment Link**

The game is live [**here**](https://space-force-game.herokuapp.com/).

## Local Deployment

Requirements: Python, Flask, Postgresql



**To deploy locally using Python 3.711, pip, and Flask - Initialize PostgreSQL in your operating system and run the following commands in your terminal:**

**Clone Repository and Enter Directory of Repo**

`git clone https://github.com/philipbrowne/Space-Force`

`cd Space-Force`

**Create and Activate Python Virtual Environment**

`python3.7 -m venv venv`

`source venv/bin/activate`

`pip install -r requirements.txt`

**To Set Up Our Local Database:**

`createdb spaceforce-db`

``python3.7 seed.py`

**Run Application With Flask**

`export FLASK_ENV=production`

`export FLASK_RUN_PORT=8000`

`flask run`

Open the page in Google Chrome/Mozilla Firefox/Microsoft Edge at http://localhost:8000/

## Developer

**[Phil Browne](https://www.linkedin.com/in/philbrownetech/)**

![](https://space-force-game.herokuapp.com/assets/images/phil.jpg)
