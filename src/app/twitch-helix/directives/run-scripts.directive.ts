import { Directive, ElementRef, OnInit } from '@angular/core';

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[runScripts]' })
export class RunScriptsDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}
  ngOnInit(): void {
    setTimeout(() => {
      // wait for DOM rendering
      this.reinsertScripts();
    });
  }
  reinsertScripts(): void {
    const scripts = this.elementRef.nativeElement.getElementsByTagName(
      'script'
    ) as HTMLScriptElement[];
    // const scripts = this.elementRef.nativeElement.getElementsByTagName('script') as HTMLScriptElement[];
    const scriptsInitialLength = scripts.length;
    for (let i = 0; i < scriptsInitialLength; i++) {
      const script = scripts[i];
      const scriptCopy = document.createElement('script') as HTMLScriptElement;
      // const scriptCopy = document.createElement('script') as HTMLScriptElement;
      scriptCopy.type = script.type ? script.type : 'text/javascript';
      if (script.innerHTML) {
        scriptCopy.innerHTML = script.innerHTML;
      } else if (script.src) {
        scriptCopy.src = script.src;
      }
      scriptCopy.async = false;
      script.parentNode.replaceChild(scriptCopy, script);
    }
  }
}
