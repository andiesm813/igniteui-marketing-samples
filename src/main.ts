import { bootstrapApplication } from '@angular/platform-browser';
import { IgcGridLite } from 'igniteui-grid-lite';
import { IgcAvatarComponent, IgcRatingComponent } from 'igniteui-webcomponents';
import { appConfig } from './app/app.config';
import { App } from './app/app';

IgcGridLite.register();
IgcAvatarComponent.register();
IgcRatingComponent.register();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
