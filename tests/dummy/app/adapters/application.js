import { ActiveModelAdapter } from 'active-model-adapter';

export default class ApplicationAdapter extends ActiveModelAdapter {
  namespace = 'api';
  shouldReloadAll() {
    return true;  
  }
}
