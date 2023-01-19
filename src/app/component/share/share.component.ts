import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Graph } from 'src/app/model/graph';
import JSONCrush from 'JSONCrush';
import * as cp from 'clipboard';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements DoCheck {
  @Input() graph!: Graph;
  @ViewChild('copyBtn') copyBtn!: ElementRef<HTMLAnchorElement>;

  private clipboard!: cp;
  private shareLink = '';
  protected copied = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngDoCheck(): void {
    this.shareLink =
      window.location.host +
      '/?graph=' +
      encodeURIComponent(JSONCrush.crush(JSON.stringify(this.graph)));

    if (this.copyBtn) {
      this.copyBtn.nativeElement.dataset['clipboardText'] = this.shareLink;
    }
  }

  ngAfterViewInit(): void {
    this.copyBtn.nativeElement.dataset['clipboardText'] = this.shareLink;
    this.clipboard = new cp(this.copyBtn.nativeElement);

    this.clipboard.on('success', () => {
      this.copied = true;
      this.cd.markForCheck();

      setTimeout(() => {
        this.copied = false;
        this.cd.markForCheck();
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    this.clipboard.destroy();
  }
}
