import { router } from './router';
let appContainer = document.getElementById('app');

if (!appContainer) {
  appContainer = document.createElement('div');
  appContainer.id = 'app';
  document.body.appendChild(appContainer);
}

router.init();
