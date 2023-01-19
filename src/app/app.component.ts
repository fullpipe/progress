import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Graph } from './model/graph';
import JSONCrush from 'JSONCrush';
import { StorageService } from './service/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  graph: Graph | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StorageService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event! instanceof NavigationEnd) {
        return;
      }

      let params = this.route.snapshot.queryParamMap;
      if (!params.has('graph')) {
        this.initLocalGraph();
        return;
      }

      try {
        this.graph = JSON.parse(
          JSONCrush.uncrush(params.get('graph')!)
        ) as Graph;

        let url = new URL(location.href);
        url.searchParams.delete('graph');
        window.history.pushState({}, document.title, url);
      } catch (error) {
        console.error(error);
      }
    });
  }

  initLocalGraph() {
    this.graph = this.store.get<Graph>('graph', {
      x: [0, 10, 1],
      funcs: [
        {
          raw: '{{A}} * Math.pow(x, {{B}}) - {{C}} * x',
          params: { A: 500, B: 2, C: 500 },
          label: 'D&D Levels',
        },
      ],
    });
  }

  save(graph: Graph) {
    this.store.set('graph', graph);
  }
}
