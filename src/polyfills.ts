import '@angular/localize/init';
import { Buffer } from 'buffer';

globalThis.Buffer = Buffer;
(window as any).global = window; // Ensure global is defined
(window as any).Buffer = (window as any).Buffer || Buffer;
