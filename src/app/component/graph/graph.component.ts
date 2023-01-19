import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, Plugin } from 'chart.js';
import { buildFunc } from 'src/app/func/build';
import { Graph } from 'src/app/model/graph';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent {
  protected graph!: Graph;
  private funcs: ((x: number) => number)[] = [];
  protected edit: { [key: number]: boolean } = {};
  protected errors: { [key: number]: boolean } = {};
  protected showTable = false;

  @Input('graph') set setGraph(graph: Graph) {
    this.graph = graph;
    this.rebuild();
    this.draw();
  }
  @Output() graphChange = new EventEmitter<Graph>();

  private chart!: Chart;

  protected chartPlugins: Plugin<'line', any>[] = [
    {
      id: 'chart_instance',
      afterInit: (chart: Chart): any => {
        this.chart = chart;
      },
    },
  ];

  protected lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  protected lineChartOptions: ChartOptions<'line'> = {
    animation: false,
    responsive: true,
    interaction: {
      mode: 'closestCol',
    },
    plugins: {
      tooltip: {
        position: 'nearest',
      },
    },
  };
  protected lineChartLegend = true;

  protected share = '';

  constructor(private cd: ChangeDetectorRef) {}

  rebuild() {
    this.lineChartData.datasets = [];
    this.funcs = [];

    this.graph.funcs.forEach((f) => {
      this.lineChartData.datasets.push({
        label: f.label ? f.label : f.raw,
        data: [],
      });

      this.funcs.push(buildFunc(f.raw, f.params));

      // TODO: handle rounding
    });

    this.cd.detectChanges();
    this.graphChange.emit(this.graph);
  }

  deleteFunc(idx: number) {
    this.graph.funcs.splice(idx, 1);

    this.rebuild();
    this.draw();
  }

  addFunc() {
    this.graph.funcs.push({
      raw: `{{A}} + {{B}} * x`,
      params: { A: 1, B: 2 },
    });

    this.rebuild();
    this.draw();
  }

  draw() {
    const labels = [];
    for (let x = this.graph.x[0]; x <= this.graph.x[1]; x += this.graph.x[2]) {
      labels.push(x);
    }
    this.lineChartData.labels = labels;

    this.funcs.forEach((f, idx) => {
      const data = [];
      for (
        let x = this.graph.x[0];
        x <= this.graph.x[1];
        x += this.graph.x[2]
      ) {
        data.push(f(x));
      }

      this.lineChartData.datasets[idx].data = data;
    });

    if (this.chart) {
      this.chart.update();
    }
  }
}
