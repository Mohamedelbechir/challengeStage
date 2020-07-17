import { Conversation } from './conversation';
import { Besoin } from './besoin';
import { Entreprise } from './entreprise';

export interface Client {
    id: string;
    nom: string;
    prenom: string;
    statut: string;
    rappel: string;
    titre: string;
    email: string;
    telephoneU: string;
    telephoneD: string;
    telephoneM: string;
    linkedIn: string;
    observation: string;
    techOutils: string;
    pushs: string[];
    plaquette: string;
    conversations: Conversation[];
    besoins:Besoin[];
    entreprise: Entreprise | any;
}