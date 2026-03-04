import { Game } from './core/Game';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app');

const canvas = document.createElement('canvas');
app.appendChild(canvas);

const game = new Game(app, canvas);
game.start();
