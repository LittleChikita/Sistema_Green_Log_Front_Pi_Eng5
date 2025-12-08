import {AfterViewInit, Component} from '@angular/core';
import {GrafoService} from '../../../services/grafo-service';
import {DataSet} from 'vis-data';
import {Network} from 'vis-network';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit{
  constructor(private grafoService: GrafoService) {}

  ngAfterViewInit(): void {
    this.carregarGrafo();
  }

  carregarGrafo() {
    this.grafoService.getGrafo().subscribe(grafo => {
      console.log("📌 Grafo recebido:", grafo);
      this.initGraph(grafo.nodes, grafo.edges);
    });
  }

  initGraph(nodes: any[], edges: any[]) {

    const visNodes = new DataSet(
      nodes.map(n => ({
        id: n.id,
        label: n.nome,
        shape: "dot",
        size: 12,
        color: "#0d6efd"
      }))
    );

    const visEdges = new DataSet(
      edges.map(e => ({
        id: e.id,
        from: e.origemId,
        to: e.destinoId,
        label: String(e.distancia),
        arrows: "to",
        color: "#1450db",
        font: { align: "middle" }
      }))
    );

    const container = document.getElementById("mynetwork")!;
    const data = { nodes: visNodes, edges: visEdges };

    const options = {
      physics: {
        enabled: true,
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -12000,
          springLength: 150,
        }
      },
      edges: {
        smooth: {
          enabled: true,
          type: "continuous",
          roundness: 0.5
        }
      },
      interaction: {
        zoomView: true,
        dragView: true,
        hover: true
      }
    };

    const network = new Network(container, data, options);

  }
}
