import { router } from './router';
import { savedCredentials, connectWebSocket, userCredentials} from './authorization_page/authorization';
let appContainer = document.getElementById('app');

savedCredentials()

if (userCredentials){
  connectWebSocket()
}

if (!appContainer) {
  appContainer = document.createElement('div');
  appContainer.id = 'app';
  document.body.appendChild(appContainer);
}
router.init();
