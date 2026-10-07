import type { BackgroundNodeType } from '../../../data/types/reactFlow';
import img1Puc from '@/assets/map-background/fundo1-puc.webp';
import img1SaoGabriel from '@/assets/map-background/fundo1-estacao-sao-gabriel.webp';
import img2OuroMinas from '@/assets/map-background/fundo2-ouro-minas.webp';
import img2MinasShopping from '@/assets/map-background/fundo2-minas-shopping.webp';
import img3PracaEstacao from '@/assets/map-background/fundo3-praca-estacao.webp';
import img3MercadoCentral from '@/assets/map-background/fundo3-mercado-central.webp';
import img4IgrejaLago from '@/assets/map-background/fundo4-igreja-lago.webp';
import img4teste from '@/assets/map-background/Pìrulito Roda.jpg';

export const backgroundNodes: BackgroundNodeType[] = [
  {
    id: 'bg-img1-sao-gabriel',
    type: 'background',
    position: { x: -1920, y: -1800 },
    data: {
      id: '1',
      image: img1Puc,
      alt: 'Imagem de fundo PUC São Gabriel',
      width: 2000,
      height: 2800,
    },
    zIndex: -10,
    draggable: false,
    selectable: false,
  },
  {
    id: 'bg-img1-estacao-sao-gabriel',
    type: 'background',
    position: { x: 78, y: -1800 },
    data: {
      id: '1',
      alt: 'Imagem de fundo Estação São Gabriel',
      image: img1SaoGabriel,
      width: 1920,
      height: 2800,
    },
    zIndex: -10,
    draggable: false,
    selectable: false,
  },
  {
    id: 'bg-img2-minas-shopping',
    type: 'background',
    position: { x: -1920, y: -4599 },
    data: {
      id: '1',
      alt: 'Imagem de fundo Minas Shopping',
      image: img2MinasShopping,
      width: 2000,
      height: 2800,
    },
    zIndex: -10,
    draggable: false,
    selectable: false,
  },
  {
    id: 'bg-img2-ouro-minas',
    type: 'background',
    position: { x: 78, y: -4599 },
    data: {
      id: '1',
      alt: 'Imagem de fundo Ouro Minas',
      image: img2OuroMinas,
      width: 1920,
      height: 2800,
    },
    zIndex: -10,
    draggable: false,
    selectable: false,
  },
  {
    id: 'bg-img3-mercado-central',
    type: 'background',
    position: { x: -1920, y: -7398 },
    data: {
      id: '3',
      alt: 'Imagem de fundo Mercado Central',
      image: img3MercadoCentral,
      width: 2000,
      height: 2800,
    },
    zIndex: -10,
    draggable: false,
    selectable: false,
  },
  {
    id: 'bg-img3-praca-estacao',
    type: 'background',
    position: { x: 78, y: -7398 },
    data: {
      id: '4',
      alt: 'Imagem de fundo Praça da Estação',
      image: img3PracaEstacao,
      width: 1920,
      height: 2800,
    },
    zIndex: -10,
    draggable: false,
    selectable: false,
  },
  {
    id: 'bg-img4-igreja-lago',
    type: 'background',
    position: { x: -1920, y: -10197 },
    data: {
      id: '5',
      alt: 'Imagem de fundo Igreja do Lago',
      image: img4IgrejaLago,
      width: 2000,
      height: 2800,
    },
    zIndex: -10,
    draggable: false,
    selectable: false,
  },
  {
    id: 'bg-img4-pirulito-roda',
    type: 'background',
    position: { x: 78, y: -10197 },
    data: {
      id: '6',
      alt: 'Imagem de fundo Pirulito Roda',
      image: img4teste,
      width: 1920,
      height: 2800,
    },
    zIndex: -10,
    draggable: false,
    selectable: false,
  },
];
