import { createAuthorization, isAuthenticated } from './authorization_page/authorization';
import { createMain } from './main/main';
import { createHeader } from './header/header';
import { createFooter } from './footer/footer';
import { createInfo } from './info_page/info';

type Route = {
  path: string;
  render: () => void;
  protected?: boolean;
};

class Router {
  private routes: Route[] = [];
  private currentPath: string = window.location.pathname;
  private initialized: boolean = false;

  constructor() {
    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname;
      this.renderRoute();
    });
  }
  private clearDOM() {
    const appContainer = document.getElementById('app') || document.body;
    appContainer.innerHTML = '';
  }
  public init() {
    if (this.initialized) return;
    this.initialized = true;

    this.addRoute('/login', () => {
      const app = document.getElementById('app');
      if (!app) return;

      app.innerHTML = '';
      createAuthorization();
    });

    this.addRoute(
      '/chat',
      () => {
        const appContainer = document.getElementById('app') || document.body;
        appContainer.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'app-container';

        const header = createHeader();
        const main = createMain();
        const footer = createFooter();

        container.append(header, main, footer);
        appContainer.append(container);
      },
      true,
    );

    this.addRoute('/info', () => {
      const appContainer = document.getElementById('app') || document.body;
      appContainer.innerHTML = '';

      const info = createInfo();
      appContainer.append(info);
    });

    if (this.currentPath === '/' || !this.routes.some((r) => r.path === this.currentPath)) {
      this.navigate('/login');
    } else {
      this.renderRoute();
    }
  }

  addRoute(path: string, render: () => void, protectedRoute = false) {
    this.routes.push({ path, render, protected: protectedRoute });
    return this;
  }

  navigate(path: string) {
    if (this.currentPath === path) return;

    history.pushState({}, '', path);
    this.currentPath = path;
    this.renderRoute();
  }

  private renderRoute() {
    const route = this.routes.find((r) => r.path === this.currentPath);

    if (!route) {
      console.warn(`Route ${this.currentPath} not found, redirecting to /login`);
      this.navigate('/login');
      return;
    }

    if (route.protected && !isAuthenticated()) {
      console.warn(`Unauthorized access to ${this.currentPath}, redirecting to /login`);
      this.navigate('/login');
      return;
    }

    try {
      route.render();
    } catch (e) {
      console.error(`Error rendering route ${this.currentPath}:`, e);
      this.navigate('/login');
    }
  }
}

export const router = new Router();
