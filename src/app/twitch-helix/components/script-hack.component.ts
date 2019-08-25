import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'script-hack',
  templateUrl: './script-hack.component.html',
})
export class ScriptHackComponent implements AfterViewInit {
  @ViewChild('script', { static: false }) script: ElementRef;
  @Input() src: string;
  @Input() type: string;

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.type = this.type ? this.type : 'text/javascript';
    if (this.src) {
      script.src = this.src;
    }

    script.async = false;
    script.defer = false;

    if (element.innerHTML) {
      script.innerHTML = element.innerHTML;
    }
    const parent = element.parentElement;
    parent.parentElement.replaceChild(script, parent);

    // script.onload = () => {
    // };
  }

  ngAfterViewInit() {
    this.convertToScript();
  }
}
