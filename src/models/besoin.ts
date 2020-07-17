import { AppelOffre } from './appelOffre';
import { Source } from './source';

export interface Besoin {
    date: string;
    description: string;
    statut: string;
    appelOffre: AppelOffre | any;
    sources: Source ;
}