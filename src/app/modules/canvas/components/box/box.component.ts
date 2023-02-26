import { Element } from '../../models/element';
import { CanvasService } from '../../services/canvas/canvas.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Box } from '../../models/box';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sfc-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent implements OnInit {
  @Input() public box!: Box;
  @Input() public hasFocus = false;
  @Input() public isExportingAsPdf = false;
  @Input() public readOnly = false;
  @ViewChild('inputText') public inputText!: ElementRef<HTMLElement>;
  @Output() isUpdated = new EventEmitter<boolean>();
  private subscription: Subscription = new Subscription();
  public text = '';
  public textList: string[] = [];
  public textReadOnly: string[] = [];
  public isInputShown = false;

  constructor(private canvasService: CanvasService) {}

  ngOnInit(): void {
    const canvas = this.canvasService.injectCanvas$.value;
    if (canvas) {
      this.canvasService.elementList$.next([...canvas.allElements]);
      canvas.allElements.forEach((elem) => {
        if (elem.caseCanvas === this.box.number && elem.contenu !== '') {
          this.textList.push(elem.contenu);
        }
      });
    }
    const elementList$ = this.canvasService.elementList$.subscribe((elem) => {
      if (elem.length === 0) {
        this.textList = [];
      }
    });
    this.subscription.add(elementList$);
    const elementReadOnlyList$ = this.canvasService.elementReadOnlyList$.subscribe((elemTab) => {
      this.textReadOnly = [];
      elemTab
        .filter((elem) => elem.caseCanvas === this.box.number)
        .forEach((elem) => this.textReadOnly.push(elem.contenu));
    });
    this.subscription.add(elementReadOnlyList$);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public showInput(): void {
    this.isInputShown = true;
    this.canvasService.focusedBox$.next(this.box.number);
    requestAnimationFrame(() => this.inputText?.nativeElement.focus());
  }

  public hideInput(): void {
    this.isInputShown = false;
    this.canvasService.focusedBox$.next(null);
    this.addText();
  }

  public addText(): void {
    if (this.text) {
      this.textList.push(this.text);
      this.text = '';
      this.updateCanvasState();
      this.isUpdated.emit(true);
    }
  }

  public removeText(text: string): void {
    const idx: number = this.textList.findIndex((txt) => txt === text);
    this.textList.splice(idx, 1);
    this.canvasService.elementList$.next(
      this.canvasService.elementList$.value.filter(
        (elem) => elem.contenu !== text || elem.caseCanvas !== this.box.number
      )
    );
    this.updateCanvasState();
    this.isUpdated.emit(true);
  }

  private updateCanvasState(): void {
    const elementList: Element[] = [...this.canvasService.elementList$.value];
    let element: Element;
    this.textList.forEach((text) => {
      element = new Element(this.box.number, text);
      const elementExists = elementList.find(
        (elt) => elt.caseCanvas === this.box.number && elt.contenu === text
      );
      if (!elementExists) {
        elementList.push(element);
      }
    });
    this.canvasService.elementList$.next([...elementList]);
  }
}
