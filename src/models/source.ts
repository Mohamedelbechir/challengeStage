import { Prestataire } from './prestataire';

export interface Source {
    _links: {
        prestataire: { href: string }
    }
}