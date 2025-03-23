import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  createComponent,
  inject,
} from '@angular/core';
import { LoadingScreenComponent } from '../shared/loading-screen/loading-screen.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private componentRef: ComponentRef<LoadingScreenComponent> | null = null;
  private appRef = inject(ApplicationRef);

  private createLoadingComponent() {
    if (!this.componentRef) {
      const factory = createComponent(LoadingScreenComponent, {
        environmentInjector: this.appRef.injector,
      });
      this.appRef.attachView(factory.hostView);
      document.body.appendChild(factory.location.nativeElement);
      this.componentRef = factory;
    }
  }

  show() {
    this.createLoadingComponent();
    this.componentRef!.instance.isVisible = true;
  }

  hide() {
    if (this.componentRef) {
      this.componentRef.instance.isVisible = false;
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
