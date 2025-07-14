import type { Manhwa } from './types';

export const manhwaList: Manhwa[] = [
  {
    id: 'solo-leveling',
    title: 'Solo Leveling',
    author: 'Chugong',
    description: 'In a world where hunters, humans with supernatural abilities, must battle deadly monsters to protect humanity, a notoriously weak hunter finds himself in a struggle for survival.',
    coverUrl: 'https://placehold.co/300x450.png',
    genres: ['Action', 'Fantasy', 'Adventure'],
    isTrending: true,
    chapters: [
      { id: 1, title: 'Chapter 1', pages: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
      { id: 2, title: 'Chapter 2', pages: Array.from({ length: 18 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
      { id: 3, title: 'Chapter 3', pages: Array.from({ length: 16 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
    ],
  },
  {
    id: 'tower-of-god',
    title: 'Tower of God',
    author: 'SIU',
    description: 'A boy named Bam, who has spent his life trapped beneath a mysterious tower, chases after his only friend, Rachel, as she enters it.',
    coverUrl: 'https://placehold.co/300x450.png',
    genres: ['Action', 'Fantasy', 'Mystery'],
    isTrending: true,
    chapters: [
      { id: 1, title: 'S1 - Chapter 1', pages: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
      { id: 2, title: 'S1 - Chapter 2', pages: Array.from({ length: 22 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
    ],
  },
  {
    id: 'the-beginning-after-the-end',
    title: 'The Beginning After The End',
    author: 'TurtleMe',
    description: 'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Beneath the glamorous exterior of a powerful king lurks the shell of man, devoid of purpose and will.',
    coverUrl: 'https://placehold.co/300x450.png',
    genres: ['Action', 'Fantasy', 'Isekai'],
    isTrending: false,
    chapters: [
       { id: 1, title: 'Chapter 1', pages: Array.from({ length: 25 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
    ],
  },
  {
    id: 'omniscient-readers-viewpoint',
    title: 'Omniscient Reader\'s Viewpoint',
    author: 'Sing-Shong',
    description: 'Kim Dokja does not consider himself the protagonist of his own life. His sole hobby is reading the web novel "Three Ways to Survive the Apocalypse," and he is its only reader to have followed it to its end. When the real world is suddenly plunged into the apocalyptic landscape of the novel, Dokja is uniquely prepared.',
    coverUrl: 'https://placehold.co/300x450.png',
    genres: ['Action', 'Fantasy', 'Apocalyptic'],
    isTrending: true,
    chapters: [
      { id: 1, title: 'Chapter 1', pages: Array.from({ length: 30 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
      { id: 2, title: 'Chapter 2', pages: Array.from({ length: 28 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
    ],
  },
  {
    id: 'sweet-home',
    title: 'Sweet Home',
    author: 'Kim Carnby',
    description: 'As a reclusive high school student, Cha Hyun-soo is forced to leave his home, only to face a reality where monsters are trying to wipe out humanity.',
    coverUrl: 'https://placehold.co/300x450.png',
    genres: ['Horror', 'Thriller', 'Apocalyptic'],
    isTrending: false,
    chapters: [
      { id: 1, title: 'Chapter 1', pages: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
    ],
  },
  {
    id: 'noblesse',
    title: 'Noblesse',
    author: 'Son Jeho',
    description: 'He awakens from 820 years of slumber and has no knowledge of the modern world. In his quest to familiarise himself with this new era, he enrolls in a high school and befriends a group of students.',
    coverUrl: 'https://placehold.co/300x450.png',
    genres: ['Action', 'Supernatural', 'Comedy'],
    isTrending: false,
    chapters: [
      { id: 1, title: 'Chapter 1', pages: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, imageUrl: `https://placehold.co/800x1200.png` })) },
    ],
  },
];
