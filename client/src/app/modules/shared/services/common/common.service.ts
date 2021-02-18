import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  isMenuVisible: any = new BehaviorSubject(false);
  constructor() {}
}
