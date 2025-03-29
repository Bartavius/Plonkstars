Link to the backend repo: https://github.com/pzhang345/PlonkStarsBackend

## What is Plonkstars?
Plonkstars, inspired by GeoGuessr, is a completely free (both developer side and user side) geolocation guessing game using Google Streetview Embeds and React Leaflet's functionality to create a seamlessly addictive game.

As active GeoGuessr players, my friends and I were heartbroken when we heard that GeoGuessr was going to charge users a monthly subscription as it became too expensive to maintain its functionalities. As broke college students, this was an absolute dealbreaker. So instead, we figured we would make it ourselves, completely free.

## Getting started
head over to https://plonkstars.vercel.app and register an account. Click on the Game tab and input your game settings: the map, the no. of rounds (-1 for infinite rounds), and the time per round in seconds (-1 for infinite). If you want to play a game synchronously with a friend, you can enter in the match ID (found in the URL) and paste it into the join game input box. Otherwise, you can get started on a new game!

Select the minimap to place your guess after looking around on the streetview embed, and take your guess! Your distance from the correct location will then be displayed on the results page. Then try again! Have fun! Just don't get too addicted and let it distract you from class.

## Tech stack
Frontend - React.js, TailwindCSS, Next.js<br>
Backend - Flask, PostgreSQL

Server-side is hosted on Heroku<br>
Client-side is hosted on Vercel